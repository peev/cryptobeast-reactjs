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

  const removePortfolio = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  const sync = async (req, res, addresses) => {
    const portfolioArray = addresses.map(async (address) => {
      const portfolio = await WeidexService.getUser(address)
        .then(data => data.json())
        .catch(error => res.status(404).send({ isSuccessful: false, message: error }));
      const bodyWrapper = Object.assign({ body: portfolio });
      await syncPortfolio(bodyWrapper, res);
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
  };
};

module.exports = portfolioController;
