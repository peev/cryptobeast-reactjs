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
    },
  })
    .catch(err => console.log(err));

  const getCurrency = async tokenNameParam => repository.findOne({
    modelName: 'Currency',
    options: {
      where: {
        tokenName: tokenNameParam,
      },
    },
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

  const sumBalance = balance => balance.reduce((acc, item) => BigNumberService.sum(acc, item.balance), 0);

  const getLastBalance = (start, end, allocations) => {
    const filtered = allocations.filter(allocation =>
      new Date(allocation.timestamp.toString()).getTime() >= start && new Date(allocation.timestamp.toString()).getTime() <= end);
    return (filtered[filtered.length - 1] !== undefined) ? sumBalance(filtered[filtered.length - 1].balance) : undefined;
  };

  const getPortfolioValueHistory = async (req, res) => {
    const { id } = req.params;
    try {
      const allocations = await getAllocations(id);
      const today = new Date().getTime();
      const yesterday = today - (24 * 60 * 60 * 1000);
      const begin = new Date((allocations[0].timestamp).toString()).getTime();
      const days = calculateDays(getEndOfDay(begin), getEndOfDay(yesterday));
      const result = [];
      days.map((day, index) => {
        const start = getStartOfDay(day);
        const item = getLastBalance(start, day, allocations);
        return (item !== undefined) ? result.push({ timestamp: day, balance: item }) : result.push({ timestamp: day, balance: result[index - 1].balance });
      });
      res.status(200).send(result);
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
