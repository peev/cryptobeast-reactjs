const { responseHandler } = require('../utilities/response-handler');

const modelName = 'Portfolio';

const portfolioController = (repository) => {
  const portfolioService = require('../../services/portfolio-service')(repository);
  const WeidexService = require('../../services/weidex-service')(repository);
  const BigNumberService = require('../../services/big-number-service')(repository);

  const getPortfolioObject = async address => repository.findOne({
    modelName,
    options: {
      where: {
        userAddress: address,
      },
    },
  })
    .catch(err => console.log(err));

  const getPortfolioWholeObject = async address => repository.findOne({
    modelName,
    options: {
      where: {
        userAddress: address,
      },
      include: [{ all: true }],
    },
  })
    .catch(err => console.log(err));

  const getAllocations = async portfolioIdParam => repository.find({
    modelName: 'Allocation',
    options: {
      where: {
        portfolioID: portfolioIdParam,
      },
      order: [['timestamp', 'ASC']],
    },
  })
    .catch(err => console.log(err));

  const getCurrencyByTokenName = async tokenName => repository.findOne({
    modelName: 'Currency',
    options: {
      where: {
        tokenName,
      },
    },
  })
    .catch(err => console.log(err));

  const getCurrencies = async () => repository.find({
    modelName: 'Currency',
  })
    .catch(err => console.log(err));

  const createPortfolioObject = (address, id, investment) => {
    const portfolio = {
      userAddress: address,
      userID: id,
      totalInvestmentETH: investment || 0,
      totalInvestmentUSD: 0,
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

  const createPortfolio = async (req, res) => {
    const user = req.body;

    try {
      const porfolioFound = await getPortfolioObject(user.address);
      if (porfolioFound === null) {
        const totalInvestment = await portfolioService.calcPortfolioTotalInvestmentEthExternal(user.address).then(data => data);
        const newPortfolioObject = createPortfolioObject(user.address, user.id, totalInvestment);
        await createAction(req, res, newPortfolioObject, false);
      } else {
        const portfolio = await getPortfolioWholeObject(user.address);
        const totalInvestment = await portfolioService.calcPortfolioTotalInvestmentETH(portfolio);
        const newPortfolioObject = createPortfolioObject(user.address, user.id, totalInvestment);
        await updateAction(req, res, Number(porfolioFound.id), newPortfolioObject, false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const syncPortfolio = async (req, res) => {
    const user = req.body;

    try {
      const porfolioFound = await getPortfolioObject(user.address);
      if (porfolioFound === null || porfolioFound === undefined) {
        const totalInvestment = await portfolioService.calcPortfolioTotalInvestmentEthExternal(user.address).then(data => data);
        const newPortfolioObject = createPortfolioObject(user.address, user.id, totalInvestment);
        await createAction(req, res, newPortfolioObject, true);
      } else {
        const portfolio = await getPortfolioWholeObject(user.address);
        const totalInvestment = await portfolioService.calcPortfolioTotalInvestmentETH(portfolio);
        const newPortfolioObject = createPortfolioObject(user.address, user.id, totalInvestment);
        await updateAction(req, res, Number(porfolioFound.id), newPortfolioObject, true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updatePortfolio = async (req, res) => {
    const { id } = req.params;
    const portfolioData = Object.assign({}, req.body, { id });
    await updateAction(req, res, Number(id), portfolioData, false);
  };

  const updatePortfolioTotalInvestment = async (req, res, address) => {
    const portfolioFound = await getPortfolioWholeObject(address);

    if (portfolioFound.tensactions !== 0) {
      await portfolioService.calcPortfolioTotalInvestmentETH(portfolioFound).then((data) => {
        portfolioFound.totalInvestment = data;
        const portfolioData = Object.assign({}, portfolioFound, { id: portfolioFound.id, totalInvestment: data });
        repository.update({ modelName, updatedRecord: portfolioData })
          .then((response) => { res.status(200).send(response); })
          .catch(error => res.json(error));
      });
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

  const removePortfolio = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const getEndOfDay = (timestamp) => {
    const firstDate = new Date(timestamp);
    firstDate.setHours(23);
    firstDate.setMinutes(59);
    firstDate.setSeconds(59);
    return new Date(firstDate.toString()).getTime();
  };

  const getStartOfDay = (timestamp) => {
    const firstDate = new Date(timestamp);
    firstDate.setHours(0);
    firstDate.setMinutes(0);
    firstDate.setSeconds(0);
    return new Date(firstDate.toString()).getTime();
  };

  const calculateDays = (begin, end) => {
    const dates = [];
    for (let i = begin; i <= end; i += (24 * 60 * 60 * 1000)) {
      dates.push(i);
    }
    return dates;
  };

  const getTokenPriceByDate = async (timestamp) => {
    const currencies = await getCurrencies();
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

  // const sumBalance = async (req, res, balance, timestamp, currencies) => {
  //   const values = balance.map(async (token) => {
  //     // eslint-disable-next-line no-shadow
  //     const currency = currencies.filter(currency => currency.tokenName === token.tokenName);
  //     const tid = currency.tokenId;
  //     const tokenValue = await WeidexService.getTokenValueByTimestampHttp(tid, timestamp);
  //     console.log('------------------------------------');
  //     console.log(tokenValue);
  //     console.log('------------------------------------');
  //     return (token.tokenName === 'ETH') ? token.balance : BigNumberService.product(token.amount, tokenValue);
  //   });
  //   await Promise.all(values).then((data) => {
  //     return data.reduce((acc, item) => BigNumberService.sum(acc, item.balance), 0);
  //   });
  // };

  /**
   * Get balance of last allocation for a day period
   * @param {*} start
   * @param {*} end
   * @param {*} allocations
   */
  const getLastBalanceForDay = async (start, end, allocations) => {
    const lastBalanceForDay = allocations.filter(allocation =>
      new Date(allocation.timestamp.toString()).getTime() >= start &&
      new Date(allocation.timestamp.toString()).getTime() <= end);
    return (lastBalanceForDay.length > 0) ? lastBalanceForDay[lastBalanceForDay.length - 1].balance : undefined;
  };

  const sumBalance = balance => balance.reduce((acc, item) => BigNumberService.sum(acc, item.balance), 0);

  const getBalancesByDate = async (timestamps, allocations) => {
    const result = timestamps.map(async (timestamp) => {
      const startTimestamp = getStartOfDay(timestamp);
      const item = await getLastBalanceForDay(startTimestamp, timestamp, allocations);
      return { timestamp, balance: item };
    });
    return Promise.all(result)
      .then(data => data)
      .catch(err => console.log(err));
  };

  /**
   * Fill array balances with previous date balance values if
   * there is no transactions for that day period
   * @param {*} balances
   */
  const fillPreviousBalances = (balances) => {
    const result = [];
    balances.map((item, index) => {
      if (item.balance === undefined) {
        const previousItem = result[index - 1];
        return result.push({ timestamp: item.timestamp, balance: previousItem.balance });
      }
      return result.push(item);
    });
    return result;
  };

  const getPortfolioValueHistory = async (req, res) => {
    const { id } = req.params;
    try {
      const allocations = await getAllocations(id);
      const today = new Date().getTime();
      const yesterday = today - (24 * 60 * 60 * 1000);
      const begin = new Date((allocations[0].timestamp).toString()).getTime();
      const days = calculateDays(getEndOfDay(begin), getEndOfDay(yesterday));
      const tokenPricesByDate = await getTokensPriceByDate(days);
      const balances = await getBalancesByDate(days, allocations);
      const filledPreviousBalances = fillPreviousBalances(balances);
      const result = days.map((timestamp, index) => {
        const finalArr = [];
        const balance = filledPreviousBalances[index].balance;
        const amount = tokenPricesByDate[index];
        balance.map((token) => {
          const valueArr = [];
          amount.map((item) => {
            if (token.tokenName === item.tokenName) {
              const value = BigNumberService.product(token.amount, item.value);
              valueArr.push(value);
            }
          });
          const final = { timestamp, value: valueArr.reduce((acc, qq) => BigNumberService.sum(acc, qq), 0) };
          finalArr.push(final);
        });
        return finalArr;
      });
      console.log('------------------------------------');
      console.log(tokenPricesByDate);
      console.log(filledPreviousBalances);
      console.log(result);
      console.log('------------------------------------');
      await Promise.all(days).then((data) => {
        console.log('------------------------------------');
        console.log(data);
        console.log('------------------------------------');
        return data.reduce((acc, item) => BigNumberService.sum(acc, item.balance), 0);
      });
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
    createPortfolio,
    updatePortfolio,
    updatePortfolioTotalInvestment,
    getPortfolio,
    removePortfolio,
    sync,
    getPortfoliosByAddresses,
    getPortfolioAssetsByPortfolioId,
    getPortfolioValueHistory,
  };
};

module.exports = portfolioController;
