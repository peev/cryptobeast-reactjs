const modelName = 'Portfolio';

const portfolioController = (repository) => {
  const weidexService = require('../../services/weidex-service')(repository);
  const bigNumberService = require('../../services/big-number-service')();
  const intReqService = require('../../services/internal-requeter-service')(repository);
  const commomService = require('../../services/common-methods-service')();
  const { etherScanServices } = require('../../integrations/etherScan-services');

  const createPortfolioObject = (address, id, totalInvestmentETH, totalInvestmentUSD) => {
    const portfolio = {
      userAddress: address,
      userID: id,
      totalInvestmentETH: totalInvestmentETH || 0,
      totalInvestmentUSD: totalInvestmentUSD || 0,
    };
    return portfolio;
  };

  const updateAction = async (req, res, id, portfolioObject, isSyncing) => {
    const newPortfolioData = Object.assign({}, portfolioObject, { id });
    await repository.update({ modelName, updatedRecord: newPortfolioData })
      .then(response => (isSyncing ? response : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createAction = async (req, res, portfolioObject, isSyncing) => {
    await repository.create({ modelName, newObject: portfolioObject })
      .then(response => (isSyncing ? response : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const getPortfolioInvestmentSum = async (address, fetchDeposits) => {
    let items = [];
    const user = await weidexService.getUserHttp(address);
    if (fetchDeposits) {
      items = await weidexService.getUserDepositHttp(user.id);
    } else {
      items = await weidexService.getUserWithdrawHttp(user.id);
    }
    const transactionsArray = await items.map(async (tr) => {
      const etherScanTransaction = await etherScanServices().getTransactionByHash(tr.txHash);
      const etherScanTrBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
      const ethToUsd = await commomService.getEthToUsd(etherScanTrBlock.timestamp);
      const currency = await intReqService.getCurrencyByTokenName(tr.tokenName);
      const tokenPriceInEth = await (tr.tokenName === 'ETH') ? 1 :
        await weidexService.getTokenValueByTimestampHttp(currency.tokenId, Number(etherScanTrBlock.timestamp));
      return (etherScanTransaction !== null && etherScanTransaction !== undefined) ?
        {
          eth: commomService.tokenToEth(tr.amount, tokenPriceInEth),
          usd: commomService.tokenToEthToUsd(tr.amount, tokenPriceInEth, ethToUsd),
        } : 0;
    });
    return Promise.all(transactionsArray).then((transactions) => {
      const eth = transactions.reduce((acc, obj) => ((bigNumberService.sum(acc, obj.eth))), 0);
      const usd = transactions.reduce((acc, obj) => ((bigNumberService.sum(acc, obj.usd))), 0);
      return { eth, usd };
    });
  };

  const calcPortfolioTotalInvestment = async (portfolioAddress) => {
    const depositAmount = await getPortfolioInvestmentSum(portfolioAddress, true);
    const withdrawAmount = await getPortfolioInvestmentSum(portfolioAddress, false);
    return Promise.resolve({
      eth: bigNumberService.difference(depositAmount.eth, withdrawAmount.eth),
      usd: bigNumberService.difference(depositAmount.usd, withdrawAmount.usd),
    });
  };

  const syncPortfolio = async (req, res) => {
    const user = req.body;

    try {
      const porfolioFound = await intReqService.getPortfolioByUserAddress(user.address);
      const totalInvestment = await calcPortfolioTotalInvestment(user.address).then(data => data);
      const newPortfolioObject = createPortfolioObject(user.address, user.id, totalInvestment.eth, totalInvestment.usd);
      if (porfolioFound === null || porfolioFound === undefined) {
        await createAction(req, res, newPortfolioObject, true);
      } else {
        await updateAction(req, res, Number(porfolioFound.id), newPortfolioObject, true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPortfolio = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getPortfoliosByAddresses = (req, res) => {
    const addresses = req.body;
    repository.find({
      modelName,
      options: {
        where: {
          userAddress: addresses,
        },
      },
    })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getPortfolioAssetsByPortfolioId = async (req, res) => {
    const { id } = req.params;
    try {
      const foundAssets = await repository.find({
        modelName: 'Asset',
        options: {
          where: {
            portfolioId: id,
          },
        },
      });
      return res.status(200).send(foundAssets);
    } catch (error) {
      return res.status(500).send(error);
    }
  };

  const getTokenPriceByDate = async (timestamp) => {
    const currencies = await intReqService.getCurrencies();
    const result = currencies.map(async (currency) => {
      const tokenValue = (currency.tokenName === 'ETH') ? 1 :
        await weidexService.getTokenValueByTimestampHttp(currency.tokenId, timestamp)
          .then(data => ((data.length > 0) ? data : 0));
      return {
        timestamp,
        tokenName: currency.tokenName,
        value: tokenValue,
      };
    });
    return Promise.all(result)
      .then(data => data)
      .catch(err => console.log(err));
  };

  const getTokensPriceByDate = async (timestamps) => {
    const result = timestamps.map(async (timestamp) => {
      const tokenPrice = await getTokenPriceByDate(timestamp);
      return tokenPrice;
    });
    return Promise.all(result)
      .then(data => data)
      .catch(err => console.log(err));
  };

  const defineTokenPricesArr = async (tokenPricesArr, balance, timestamp) => {
    const result = tokenPricesArr.map(async (token) => {
      if (balance.tokenName === token.tokenName) {
        const ethToUsd = await commomService.getEthToUsd(timestamp);
        const eth = bigNumberService.product(balance.amount, token.value);
        const usd = commomService.ethToUsd(eth, ethToUsd);
        return { eth, ethToUsd, usd };
      }
      return null;
    });
    return Promise.all(result).then(data => data.filter(el => el !== null));
  };

  const resolveAssets = async (balancesArr, tokenPricesArr, timestamp) => {
    const result = await balancesArr.map(async balance => defineTokenPricesArr(tokenPricesArr, balance, timestamp));
    return Promise.all(result).then((data) => {
      const eth = data.reduce((acc, obj) => (bigNumberService.sum(acc, obj[0].eth)), 0);
      const usd = data.reduce((acc, obj) => (bigNumberService.sum(acc, obj[0].usd)), 0);
      return { timestamp: timestamp * 1000, eth, usd };
    });
  };

  /**
   * Gets timestamps, token prices and token balance for each day,
   * multiply balance by price and sums.
   * @param {*} timestamps
   * @param {*} tokenPrices
   * @param {*} balances
   */
  const calculatePortfolioValueHistory = async (timestamps, tokenPrices, balances) => {
    const result = timestamps.map(async (timestamp, index) => {
      const balancesArr = balances[index].balance;
      const tokenPricesArr = tokenPrices[index];
      return resolveAssets(balancesArr, tokenPricesArr, timestamp);
    });
    return Promise.all(result).then(data => data);
  };

  const calculateDays = (begin, end) => {
    const dates = [];
    for (let i = begin; i <= end; i += (24 * 60 * 60 * 1000)) {
      dates.push(i / 1000);
    }
    return dates;
  };

  const calculateDaysBackwards = (days) => {
    const result = [];
    for (let i = 0; i <= days - 1; i += 1) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      result.push(date.getTime());
    }
    return result;
  };

  const getPortfolioValueHistory = async (req, res) => {
    const { id } = req.params;
    try {
      const allocations = await intReqService.getAllocationsByPortfolioIdAsc(id);
      const today = new Date().getTime();
      const begin = new Date((allocations[0].timestamp).toString()).getTime();
      const timestampsMiliseconds = commomService.calculateDays(commomService.getEndOfDay(begin), commomService.getEndOfDay(today));
      const timestamps = calculateDays(commomService.getEndOfDay(begin), commomService.getEndOfDay(today));
      const tokenPricesByDate = await getTokensPriceByDate(timestamps);
      const balances = await commomService.getBalancesByDate(timestampsMiliseconds, allocations);
      const filledPreviousBalances = commomService.fillPreviousBalances(balances);
      const portfolioValueHistory = await calculatePortfolioValueHistory(timestamps, tokenPricesByDate, filledPreviousBalances);
      res.status(200).send(portfolioValueHistory);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const sumAllocationBalance = async (balance, timestamp) => {
    let result = { timestamp, eth: 0, usd: 0 };
    if (balance !== null) {
      result = balance.map(async (item) => {
        const currency = await intReqService.getCurrencyByTokenName(item.tokenName);
        const ethToUsd = await commomService.getEthToUsdMiliseconds(timestamp);
        const tokenPriceInEth = (item.tokenName === 'ETH') ? 1 :
          await weidexService.getTokenValueByTimestampHttp(currency.tokenId, commomService.millisecondsToTimestamp(timestamp));
        const eth = bigNumberService.product(item.amount, tokenPriceInEth);
        const usd = commomService.ethToUsd(eth, ethToUsd);
        return { timestamp, eth, usd };
      });
    } else {
      return result;
    }
    return Promise.all(result).then(data => data);
  };

  const resolveAllocationsBalances = async (allocations) => {
    const result = await allocations.map(async allocation => sumAllocationBalance(allocation.balance, allocation.timestamp));
    return Promise.all(result).then(data =>
      data.map((item) => {
        const eth = item.reduce((acc, obj) => (bigNumberService.sum(acc, obj.eth)), 0);
        const usd = item.reduce((acc, obj) => (bigNumberService.sum(acc, obj.usd)), 0);
        return { timestamp: item[0].timestamp, eth, usd };
      }));
  };

  const resolveAllocations = async (portfolioId, timestamps) => {
    const result = await timestamps.map(async (timestamp) => {
      const allocation = await intReqService.getAllocationBeforeTimestampByPortfolioId(portfolioId, timestamp);
      return (allocation !== null) ? { timestamp, balance: allocation.balance } : { timestamp, balance: null };
    });
    return Promise.all(result).then(data => data);
  };

  const getPortfolioValueByIdAndPeriod = async (req, res) => {
    const { id } = req.params;
    const { period } = req.params;
    const daysCount = commomService.handlePeriod(period);
    const timestamps = calculateDaysBackwards(daysCount);
    try {
      const allocations = await resolveAllocations(id, timestamps);
      const filtertedAllocations = allocations.filter(data => data.balance !== null);
      const result = await resolveAllocationsBalances(filtertedAllocations);
      await res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const getAlphaResult = async (transaction, allocation, timestamp, ethUsd) => {
    const numOfShares = transaction.dataValues.numSharesAfter;
    const { balance } = allocation.dataValues;
    const tokenPricesByDate = await getTokensPriceByDate([timestamp]);
    const portfolioValue = await calculatePortfolioValueHistory([timestamp / 1000], tokenPricesByDate, [{ balance }]);
    const sharePrice = bigNumberService.quotient(portfolioValue[0].usd, numOfShares);
    return { timestamp, ethUsd, sharePrice };
  };

  const getAlpha = async (req, res) => {
    const { id } = req.params;
    const { period } = req.params;
    const { benchmark } = req.params;
    try {
      const startingDate = new Date();
      startingDate.setDate(startingDate.getDate() - period);
      const periodTs = startingDate.getTime();
      const firstDeposit = await intReqService.getFirstDeposit(id);
      const firstDepositTs = new Date((firstDeposit.txTimestamp).toString()).getTime();
      const nowTs = new Date().getTime();
      const ethUsdNow = await commomService.getEthToUsdMiliseconds(nowTs);

      let transaction = null;
      let allocation = null;
      let ethUsd = null;
      let start = null;

      if (firstDepositTs > periodTs) {
        transaction = firstDeposit;
        allocation = await intReqService.getAllocationByPortfolioIdAndTimestamp(id, firstDepositTs);
        ethUsd = await commomService.getEthToUsdMiliseconds(firstDepositTs);
        start = await getAlphaResult(transaction, allocation, firstDepositTs, ethUsd);
      } else {
        transaction = await intReqService.getTransactionBeforeTimestampByPortfolioId(id, periodTs);
        allocation = await intReqService.getAllocationBeforeTimestampByPortfolioId(id, periodTs);
        ethUsd = await commomService.getEthToUsdMiliseconds(periodTs);
        start = await getAlphaResult(transaction, allocation, periodTs, ethUsd);
      }

      const lastTransaction = await intReqService.getLastTransactionByPortfolioId(id);
      const lastAllocation = await intReqService.getLastAllocationByPortfolioId(id);

      const end = await getAlphaResult(lastTransaction, lastAllocation, nowTs, ethUsdNow);
      res.status(200).send([start, end]);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const sync = async (req, res, addresses) => {
    const portfolioArray = addresses.map(async (address) => {
      try {
        const portfolio = await weidexService.getUserHttp(address);
        const bodyWrapper = Object.assign({ body: portfolio });
        await syncPortfolio(bodyWrapper, res);
      } catch (error) {
        console.log(error);
      }
    });
    await Promise.all(portfolioArray).then(() => {
      console.log('================== END PORTFOLIOS =========================================');
    });
  };

  return {
    getPortfolio,
    sync,
    getPortfoliosByAddresses,
    getPortfolioAssetsByPortfolioId,
    getPortfolioValueHistory,
    getPortfolioValueByIdAndPeriod,
    getAlpha,
  };
};

module.exports = portfolioController;
