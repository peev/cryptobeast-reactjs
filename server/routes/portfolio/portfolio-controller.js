const { responseHandler } = require('../utilities/response-handler');

const modelName = 'Portfolio';

const portfolioController = (repository) => {
  const portfolioService = require('../../services/portfolio-service')(repository);
  const WeidexService = require('../../services/weidex-service')(repository);

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

  const createPortfolioObject = (address, id, investment) => {
    const portfolio = {
      userAddress: address,
      userID: id,
      totalInvestmentETH: investment || 0,
      totalInvestmentUSD: null,
    };
    return portfolio;
  };

  const updateAction = (req, res, id, portfolioObject, isSyncing) => {
    const newPortfolioData = Object.assign({}, portfolioObject, { id });
    repository.update({ modelName, updatedRecord: newPortfolioData })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createAction = (req, res, portfolioObject, isSyncing) => {
    repository.create({ modelName, newObject: portfolioObject })
      .then(response => (isSyncing ? null : res.status(200).send(response)))
      .catch(error => res.json(error));
  };

  const createPortfolio = async (req, res) => {
    const user = req.body;

    try {
      const porfolioFound = await getPortfolioWholeObject(user.address);

      if (porfolioFound === null) {
        const newPortfolioObject = createPortfolioObject(user.address, user.id, 0);
        await createAction(req, res, newPortfolioObject, false);
      } else {
        const totalInvestment = await portfolioService.calcPortfolioTotalInvestmentETH(porfolioFound);
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
      const porfolioFound = await getPortfolioWholeObject(user.address);

      if (porfolioFound === null) {
        const newPortfolioObject = createPortfolioObject(user.address, user.id, 0);
        await createAction(req, res, newPortfolioObject, true);
      } else {
        const totalInvestment = await portfolioService.calcPortfolioTotalInvestmentETH(porfolioFound);
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
    return updateAction(req, res, Number(id), portfolioData, false);
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

  const removePortfolio = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sync = async (req, res, addresses) => addresses.map(async (address) => {
    try {
      const portfolio = await WeidexService.getUser(address)
        .then(data => data.json())
        .catch(error => console.log(error));
      const bodyWrapper = Object.assign({ body: portfolio });

      await syncPortfolio(bodyWrapper, res);
    } catch (error) {
      console.log(error);
    }
  });

  return {
    createPortfolio,
    updatePortfolio,
    updatePortfolioTotalInvestment,
    getPortfolio,
    removePortfolio,
    sync,
  };
};

module.exports = portfolioController;
