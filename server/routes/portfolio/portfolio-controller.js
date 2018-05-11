const { CronJob } = require('cron');
const { responseHandler } = require('../utilities/response-handler');

const modelName = 'Portfolio';

const portfolioController = (repository) => {
  const portfolioService = require('../../services/portfolio-service')(repository);
  let closingSharePriceJobs;
  let openingSharePriceJobs;
  let closingPortfolioCostJobs;

  const createPortfolio = (req, res) => {
    const portfolio = req.body;
    repository.create({ modelName, newObject: portfolio })
      .then((newPortfolio) => {
        // async only this part and not the whole controller
        (async () => {
          closingSharePriceJobs[newPortfolio.id] = await portfolioService.createSaveClosingSharePriceJob(newPortfolio.id);
        })();
        (async () => {
          openingSharePriceJobs[newPortfolio.id] = await portfolioService.createSaveOpeningSharePriceJob(newPortfolio.id);
        })();
        (async () => {
          closingPortfolioCostJobs[newPortfolio.id] = await portfolioService.createSaveClosingPortfolioCostJob(newPortfolio.id);
        })();
        return newPortfolio;
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const getById = (req, res) => {
    repository.findById({ modelName, id: req.params.id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getAllPortfolios = (req, res) => {
    repository.find({
      modelName,
      options: { include: [{ all: true }] }, // Eager loading
    })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updatePortfolio = (req, res) => {
    const portfolioData = req.body;
    repository.update({ modelName, updatedRecord: portfolioData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const removePortfolio = (req, res) => {
    const { id } = req.params;
    closingSharePriceJobs[id].stop();
    delete closingSharePriceJobs[id];
    openingSharePriceJobs[id].stop();
    delete openingSharePriceJobs[id];
    closingPortfolioCostJobs[id].stop();
    delete closingPortfolioCostJobs[id];
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch((error) => {
        return res.json(error);
      });
  };

  // TODO: Calculate prices in the front end
  const updatePortfolioBTCEquivalentOnRequest = (req, res) => {
    const portfolioId = req.body.id;
    portfolioService.updatePortfolioBTCEquivalent(portfolioId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getPortfolioSharePrice = (req, res) => {
    const portfolioId = req.body.id;
    portfolioService.calcSharePrice(portfolioId)
      .then((sharePrice) => {
        res.status(200).send({ sharePrice });
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getSharePriceHistory = (req, res) => {
    repository.find({
      modelName: 'SharePrice',
      options: {
        where: {
          portfolioId: req.body.portfolioId,
          isClosingPrice: req.body.isClosingPrice,
        }
      },
    })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  // Initialize sharePriceJobs
  (async () => {
    closingSharePriceJobs = await portfolioService.initializeAllJobs(portfolioService.createSaveClosingSharePriceJob);
  })();

  (async () => {
    openingSharePriceJobs = await portfolioService.initializeAllJobs(portfolioService.createSaveOpeningSharePriceJob);
  })();

  (async () => {
    closingPortfolioCostJobs = await portfolioService.initializeAllJobs(portfolioService.createSaveClosingPortfolioCostJob);
  })();
  // const printSharePriceJobs = () => console.log('>>> closingPortfolioCostJobs: ', closingPortfolioCostJobs);
  // setTimeout(printSharePriceJobs, 10000);

  return {
    getById,
    getAllPortfolios,
    createPortfolio,
    updatePortfolio,
    removePortfolio,

    updatePortfolioBTCEquivalentOnRequest,
    getPortfolioSharePrice,
    getSharePriceHistory,
  };
};

module.exports = portfolioController;
