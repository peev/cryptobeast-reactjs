const modelName = 'Portfolio';

const portfolioController = (repository) => {
  const portfolioService = require('../../services/portfolio-service')(repository);
  const WeidexService = require('../../services/weidex-service')(repository);
  const bigNumberService = require('../../services/big-number-service')();
  const intReqService = require('../../services/internal-requeter-service')(repository);
  const commomService = require('../../services/common-methods-service')();

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

  const syncPortfolio = async (req, res) => {
    const user = req.body;

    try {
      const porfolioFound = await intReqService.getPortfolioByUserAddress(user.address);
      const totalInvestment = await portfolioService.calcPortfolioTotalInvestment(user.address).then(data => data);
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
        await WeidexService.getTokenValueByTimestampHttp(currency.tokenId, timestamp);
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

  const sync = async (req, res, addresses) => {
    const portfolioArray = addresses.map(async (address) => {
      try {
        const portfolio = await WeidexService.getUserHttp(address);
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
  };
};

module.exports = portfolioController;
