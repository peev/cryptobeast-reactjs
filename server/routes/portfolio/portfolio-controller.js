// const { CronJob } = require('cron');
const { responseHandler } = require('../utilities/response-handler');

const modelName = 'Portfolio';

const portfolioController = (repository, jobs) => {
  const portfolioService = require('../../services/portfolio-service')(repository);
  const { closingSharePriceJobs, openingSharePriceJobs, closingPortfolioCostJobs } = jobs;
  // const printSharePriceJobs = () => console.log('>>> controller jobs: ', jobs);
  // setInterval(printSharePriceJobs, 5000);

  const createPortfolio = (req, res) => {
    const portfolio = Object.assign({}, req.body, { owner: req.user.email });
    repository.create({ modelName, newObject: portfolio })
      .then((newPortfolio) => {
        // async only this part and not the whole controller
        (async () => {
          closingSharePriceJobs[newPortfolio.id] = await portfolioService.createSaveClosingSharePriceJob(newPortfolio.id);
          openingSharePriceJobs[newPortfolio.id] = await portfolioService.createSaveOpeningSharePriceJob(newPortfolio.id);
          closingPortfolioCostJobs[newPortfolio.id] = await portfolioService.createSaveClosingPortfolioCostJob(newPortfolio.id);
        })();

        return newPortfolio;
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
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
    console.log(req.user.email);
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
      .catch(error => res.json(error));
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
      .catch(error => res.json(error));
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

  const getPricesHistory = (req, res) => {
    repository.find({
      modelName: 'PortfolioPrice',
      options: {
        where: {
          portfolioId: req.body.portfolioId,
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

  const getPricesHistoryForPeriod = (req, res) => {
    const id = req.body.portfolioId;
    const time = req.body.selectedPeriod;
    const currentDate = new Date();
    let endDate;

    switch (time) {
      case '1d':
        endDate = currentDate.getTime() - (24 * 60 * 60 * 1000);
        break;
      case '1m':
        endDate = currentDate.getTime() - ((24 * 60 * 60 * 1000) * 31);
        break;
      case '1y':
        endDate = currentDate.getTime() - ((24 * 60 * 60 * 1000) * 365);
        break;
      default:
        console.log('No such time period');
        break;
    }

    repository.find({
      modelName: 'PortfolioPrice',
      options: {
        where: {
          portfolioId: id,
          createdAt: {
            $gt: new Date(endDate),
          },
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

  return {
    getById,
    getAllPortfolios,
    createPortfolio,
    updatePortfolio,
    removePortfolio,

    updatePortfolioBTCEquivalentOnRequest,
    getPortfolioSharePrice,
    getSharePriceHistory,
    getPricesHistory,
    getPricesHistoryForPeriod,
  };
};

module.exports = portfolioController;
