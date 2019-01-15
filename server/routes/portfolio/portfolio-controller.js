const modelName = 'Portfolio';

const portfolioController = (repository) => {
  const weidexService = require('../../services/weidex-service')(repository);
  const bigNumberService = require('../../services/big-number-service')();
  const intReqService = require('../../services/internal-requeter-service')(repository);
  const commonService = require('../../services/common-methods-service')();
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
      const ethToUsd = await commonService.getEthToUsd(etherScanTrBlock.timestamp);
      const currency = await intReqService.getCurrencyByTokenName(tr.tokenName);
      const tokenPriceInEth = await (tr.tokenName === 'ETH') ? 1 :
        await weidexService.getTokenValueByTimestampHttp(currency.tokenId, Number(etherScanTrBlock.timestamp));
      return (etherScanTransaction !== null && etherScanTransaction !== undefined) ?
        {
          eth: commonService.tokenToEth(tr.amount, tokenPriceInEth),
          usd: commonService.tokenToEthToUsd(tr.amount, tokenPriceInEth, ethToUsd),
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

  const defineTokenPricesArr = async (tokenPricesArr, balance, timestamp, ethPrices, isAlpha) => {
    const result = tokenPricesArr.map(async (token) => {
      if (balance.tokenName === token.tokenName) {
        if (isAlpha) {
          const ethToUsd = await commonService.getEthToUsd(timestamp);
          const eth = bigNumberService.product(balance.amount, token.value);
          const usd = commonService.ethToUsd(eth, ethToUsd);
          return { eth, ethToUsd, usd };
        }
        const ethToUsd = ethPrices.find(item => (commonService.millisecondsToTimestamp(item.timestamp) === timestamp));
        const eth = bigNumberService.product(balance.amount, token.value);
        const usd = commonService.ethToUsd(eth, ethToUsd.priceUsd);
        return { eth, ethToUsd: ethToUsd.priceUsd, usd };
      }
      return null;
    });
    return Promise.all(result).then(data => data.filter(el => el !== null));
  };

  const resolveAssets = async (balancesArr, tokenPricesArr, timestamp, ethPrices, isAlpha) => {
    const result = await balancesArr.map(async balance => defineTokenPricesArr(tokenPricesArr, balance, timestamp, ethPrices, isAlpha));
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
   * @param {*} ethPriceHistory
   * @param {*} isAlpha
   */
  const calculatePortfolioValueHistory = async (timestamps, tokenPrices, balances, ethPriceHistory, isAlpha) => {
    const result = timestamps.map(async (timestamp, index) => {
      const balancesArr = balances[index].balance;
      const tokenPricesArr = tokenPrices[index];
      return resolveAssets(balancesArr, tokenPricesArr, timestamp, ethPriceHistory, isAlpha);
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
      const timestampsMiliseconds = commonService.calculateDays(commonService.getEndOfDay(begin), commonService.getEndOfDay(today));
      const timestamps = calculateDays(commonService.getEndOfDay(begin), commonService.getEndOfDay(today));
      const ethHistory = await commonService.getEthHistoryDayValue(commonService.getEndOfDay(begin), commonService.getEndOfDay(today));
      const tokenPricesByDate = await getTokensPriceByDate(timestamps);
      const balances = await commonService.getBalancesByDate(timestampsMiliseconds, allocations);
      const filledPreviousBalances = commonService.fillPreviousBalances(balances);
      const ethPriceHistory = commonService.defineEthHistory(timestampsMiliseconds, ethHistory);
      const portfolioValueHistory = await calculatePortfolioValueHistory(timestamps, tokenPricesByDate, filledPreviousBalances, ethPriceHistory, false);
      res.status(200).send(portfolioValueHistory);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const sumAllocationBalance = async (balance, timestamp, ethPriceHistory) => {
    let result = { timestamp, eth: 0, usd: 0 };
    if (balance !== null) {
      result = balance.map(async (item) => {
        const currency = await intReqService.getCurrencyByTokenName(item.tokenName);
        const ethToUsd = ethPriceHistory.find(el => (el.timestamp === timestamp));
        const tokenPriceInEth = (item.tokenName === 'ETH') ? 1 :
          await weidexService.getTokenValueByTimestampHttp(currency.tokenId, commonService.millisecondsToTimestamp(timestamp));
        const eth = bigNumberService.product(item.amount, tokenPriceInEth);
        const usd = commonService.ethToUsd(eth, ethToUsd.priceUsd);
        return { timestamp, eth, usd };
      });
    } else {
      return result;
    }
    return Promise.all(result).then(data => data);
  };

  const resolveAllocationsBalances = async (allocations, ethPriceHistory) => {
    const result = await allocations.map(async allocation => sumAllocationBalance(allocation.balance, allocation.timestamp, ethPriceHistory));
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
    const daysCount = commonService.handlePeriod(period);
    const timestamps = calculateDaysBackwards(daysCount);
    try {
      const ethHistory = await commonService.getEthHistoryDayValue(timestamps[timestamps.length - 1], timestamps[0]);
      timestamps.sort(commonService.sortNumberDesc);
      ethHistory.sort((a, b) => b.createdAt - a.createdAt);
      const ethPriceHistory = commonService.defineEthHistory(timestamps, ethHistory);
      const allocations = await resolveAllocations(id, timestamps);
      const filtertedAllocations = allocations.filter(data => data.balance !== null);
      const result = await resolveAllocationsBalances(filtertedAllocations, ethPriceHistory);
      await res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const getShareHistory = async (req, res) => {
    const { portfolioId } = req.params;

    try {
      const firstAllocation = await intReqService.getFirstAllocationByPortfolioId(portfolioId);
      const start = new Date(firstAllocation.timestamp).getTime();
      const end = new Date().getTime();
      const transactions = await intReqService.getTransactionsByPortfolioIdAsc(portfolioId);
      const timestampsMiliseconds = commonService.calculateDays(commonService.getEndOfDay(start), commonService.getEndOfDay(end));
      const result = [];
      timestampsMiliseconds.forEach((timestamp, index) => {
        if (index === 0) {
          const currentDateTransactions = transactions.filter(tr => tr.txTimestamp <= timestamp && tr.txTimestamp >= firstAllocation.timestamp);
          result.push({ timestamp, shares: currentDateTransactions[currentDateTransactions.length - 1].numSharesAfter });
        } else {
          const currentDateTransactions = transactions.filter(tr => tr.txTimestamp <= timestamp && tr.txTimestamp >= timestampsMiliseconds[index - 1]);
          if (currentDateTransactions.length === 0) {
            result.push({ timestamp, shares: result[index - 1].shares });
          } else {
            result.push({ timestamp, shares: currentDateTransactions[currentDateTransactions.length - 1].numSharesAfter });
          }
        }
      });
      return res.status(200).send(result);
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  const getAlphaResult = async (transaction, allocation, timestamp, ethUsd, ethPriceHistory) => {
    const numOfShares = transaction.dataValues.numSharesAfter;
    const { balance } = allocation.dataValues;
    const tokenPricesByDate = await getTokensPriceByDate([timestamp]);
    const portfolioValue = await calculatePortfolioValueHistory([timestamp / 1000], tokenPricesByDate, [{ balance }], ethPriceHistory, true);
    const sharePrice = bigNumberService.quotient(portfolioValue[0].usd, numOfShares);
    return { timestamp, ethUsd, sharePrice };
  };

  const getAlpha = async (req, res) => {
    const { id } = req.params;
    const { period } = req.params;
    // const { benchmark } = req.params;
    try {
      const startingDate = new Date();
      startingDate.setDate(startingDate.getDate() - period);
      const periodTs = startingDate.getTime();
      const firstDeposit = await intReqService.getFirstDeposit(id);
      const firstDepositTs = new Date((firstDeposit.txTimestamp).toString()).getTime();
      const nowTs = new Date().getTime();
      const ethUsdNow = await commonService.getEthToUsdMiliseconds(nowTs);

      let transaction = null;
      let allocation = null;
      let ethUsd = null;
      let start = null;

      // Get eth price arr from portfolio creation date
      const allocations = await intReqService.getAllocationsByPortfolioIdAsc(id);
      const today = new Date().getTime();
      const begin = new Date((allocations[0].timestamp).toString()).getTime();
      const timestampsMiliseconds = commonService.calculateDays(commonService.getEndOfDay(begin), commonService.getEndOfDay(today));
      const ethHistory = await commonService.getEthHistoryDayValue(timestampsMiliseconds[0], timestampsMiliseconds[timestampsMiliseconds.length - 1]);
      const ethPriceHistory = commonService.defineEthHistory(timestampsMiliseconds, ethHistory);

      if (firstDepositTs > periodTs) {
        transaction = firstDeposit;
        allocation = await intReqService.getAllocationByPortfolioIdAndTimestamp(id, firstDepositTs);
        ethUsd = await commonService.getEthToUsdMiliseconds(firstDepositTs);
        start = await getAlphaResult(transaction, allocation, firstDepositTs, ethUsd, ethPriceHistory);
      } else {
        transaction = await intReqService.getTransactionBeforeTimestampByPortfolioId(id, periodTs);
        allocation = await intReqService.getAllocationBeforeTimestampByPortfolioId(id, periodTs);
        ethUsd = await commonService.getEthToUsdMiliseconds(periodTs);
        start = await getAlphaResult(transaction, allocation, periodTs, ethUsd, ethPriceHistory);
      }

      const lastTransaction = await intReqService.getLastTransactionByPortfolioId(id);
      const lastAllocation = await intReqService.getLastAllocationByPortfolioId(id);

      const end = await getAlphaResult(lastTransaction, lastAllocation, nowTs, ethUsdNow, ethPriceHistory);
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
    getShareHistory,
  };
};

module.exports = portfolioController;
