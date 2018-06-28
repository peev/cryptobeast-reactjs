// const { CronJob } = require('cron');
const { bittrexServices } = require('../../integrations/bittrex-services');
const { krakenServices } = require('../../integrations/kraken-services');
const { responseHandler } = require('../utilities/response-handler');
const AManagement = require('../../services/Auth0ManagementAPI');

const Auth0ManagementApi = new AManagement();

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

  const searchItemsInCurrentPortfolio = async (req, res) => {
    const searchedModelName = req.params.item;
    try {
      const foundAssets = await repository.find({
        modelName: searchedModelName,
        options: {
          where: {
            portfolioId: req.params.portfolioId,
          },
        },
      });

      res.status(200).send(foundAssets);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  const getAllPortfolios = async (req, res) => {
    try {
      const returnedUser = await Auth0ManagementApi.getUser(req);
      const allProfilesFound = await repository.find({
        modelName,
        options: {
          where: { owner: req.user.email },
        },
      });

      const userMetadata = returnedUser.user_metadata;
      const userApis = new Map();
      Object.keys(userMetadata).forEach((apiData) => {
        if (apiData.includes('api_account')) {
          userApis.set(apiData, {
            exchange: userMetadata[apiData].exchange,
            account: userMetadata[apiData].account,
            isActive: userMetadata[apiData].isActive,
          });
        }
      });

      const flatoutMapApis = Array.from(userApis);

      res.status(200).send({ userApis: flatoutMapApis, portfolios: allProfilesFound });
    } catch (error) {
      res.status(500).send(error);
    }
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
    searchItemsInCurrentPortfolio,
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
