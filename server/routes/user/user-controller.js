const userController = (repository, jobs) => {
  const { closingSharePriceJobs, openingSharePriceJobs, closingPortfolioCostJobs } = jobs;
  const { bittrexServices } = require('../../integrations/bittrex-services');
  const { krakenServices } = require('../../integrations/kraken-services');
  const portfolioService = require('../../services/portfolio-service')(repository);
  const AManagement = require('../../integrations/Auth0ManagementAPI');

  const Auth0ManagementApi = new AManagement();
  const modelName = 'User';


  const updateClosingTime = async (req, res) => {
    const setting = await repository.findOne({
      modelName: 'Setting',
      options: {
        where: {
          userId: req.body.userId,
          name: req.body.name,
        },
      },
    });

    if (setting === null) {
      // create new setting
      repository.create({
        modelName: 'Setting',
        newObject: {
          userId: req.body.userId,
          name: req.body.name,
          value: req.body.value,
        },
      });
    } else {
      // update selected setting
      repository.update({
        modelName: 'Setting',
        updatedRecord: {
          id: setting.id,
          userId: req.body.userId,
          name: req.body.name,
          value: req.body.value,
        },
      });
    }

    // TODO: PortfolioID should be changed with UserID
    closingSharePriceJobs[req.body.portfolioId] = await portfolioService.createSaveClosingSharePriceJob(req.body.portfolioId);
    openingSharePriceJobs[req.body.portfolioId] = await portfolioService.createSaveOpeningSharePriceJob(req.body.portfolioId);
    closingPortfolioCostJobs[req.body.portfolioId] = await portfolioService.createSaveClosingPortfolioCostJob(req.body.portfolioId);
  };

  const verifiedPatchUserMetadata = async (req, res) => {
    try {
      const { exchange, apiKey, apiSecret, portfolioId } = req.body.user_metadata.api;

      // Check user api key and secret, be requesting account balance
      const { error, returnedAssets, returnedOrderHistory } = await getUserApiData(exchange, apiKey, apiSecret, portfolioId);

      if (error) {
        res.status(400).send({ isSuccessful: false, message: error.message });
      }

      if (returnedAssets) {
        // Add given api key and secret to auth0
        const returnedUser = await Auth0ManagementApi.patchUser(req, res);

        // Add found balance to current selected portfolio
        await addAssetsToPortfolio(returnedAssets, portfolioId); // eslint-disable-line

        // Add found trade history to current selected portfolio
        await addTradeHistoryToPortfolio(returnedOrderHistory); // eslint-disable-line

        return returnedUser;
      }

      return res.status(200).send({ isSuccessful: false, message: 'No assets found' });
    } catch (err) {
      return res.status(404).send({ isSuccessful: false, message: err });
    }
  };

  const patchUserMetadata = async (req, res) => {
    const userMetadata = await Auth0ManagementApi.getUser(req);

    const apiId = req.body.user_metadata.api.id;
    const selectedUserApi = userMetadata.user_metadata[apiId];
    const updateData = req.body.user_metadata[apiId];

    Object.keys(selectedUserApi).forEach((property) => {
      if (updateData[property] !== undefined) { // if updating metadata can select current property
        selectedUserApi[property] = updateData[property];
      }
    });

    req.body.user_metadata = {
      [apiId]: selectedUserApi,
    };

    const result = await Auth0ManagementApi.patchUser(req, res);
    return result;
  };

  const deleteUserMetadata = async (req, res) => Auth0ManagementApi.patchUser(req, res);

  const syncUserApiData = async (req, res) => {
    const portfolioId = parseInt(req.params.portfolioId, 10);
    const auth0User = await Auth0ManagementApi.getUser(req, res);
    const userMetadata = auth0User.user_metadata;

    const currentPortfolioApis = [];
    const currentPortfolioApiAssets = [];
    const currentPortfolioApiHistory = [];

    const promises = [];

    // Get User Api Data
    try {
      Object.keys(userMetadata).forEach(async (property) => {
        const currentProperty = userMetadata[property];
        const currentPortfolioId = currentProperty.portfolioId;

        if (currentPortfolioId === portfolioId && property !== 'api') {
          const currentExchange = currentProperty.exchange;
          const currentApiKey = currentProperty.apiKey;
          const currentApiSecret = currentProperty.apiSecret;

          currentPortfolioApis.push(currentExchange);

          promises.push(getUserApiData(currentExchange, currentApiKey, currentApiSecret, currentPortfolioId));
        }
      });

      await Promise.all(promises)
        .then((apiResult) => {
          apiResult.forEach((item) => {
            const { returnedAssets, returnedOrderHistory } = item;
            currentPortfolioApiAssets.push(returnedAssets);
            currentPortfolioApiHistory.push(returnedOrderHistory);
          });
        });
    } catch (error) {
      return res.status(404).send({ isSuccessful: false, message: error });
    }


    // Check apis for syncing
    let updatedAssets = null;
    let updatedHistory = null;

    (async () => {
      try {
        await Promise.all(currentPortfolioApis.map(async (apiName, index) => {
          if (currentPortfolioApiAssets[index].length > 0) {
            updatedAssets = await syncPortfolioAssets(apiName, portfolioId, currentPortfolioApiAssets, index);
          }

          if (currentPortfolioApiHistory[index].length > 0) {
            updatedHistory = await syncPortfolioHistory(apiName, portfolioId, currentPortfolioApiHistory);
          }
        }));

        return res.status(200).send({
          isSuccessful: true,
          updatedAssets,
          updatedHistory,
        });
      } catch (error) {
        return res.status(404).send({ isSuccessful: false, message: error });
      }
    })();
  };


  // =================
  // Utility functions
  // =================
  const getUserApiData = async (exchange, apiKey, apiSecret, portfolioId) => {
    try {
      // const { exchange, apiKey, apiSecret } = user;
      let returnedAssets;
      let returnedOrderHistory;
      switch (exchange) {
        case 'Bittrex':
          returnedAssets = await bittrexServices().getBalance({ apiKey, apiSecret });
          returnedOrderHistory = await bittrexServices().getOderHistory({ apiKey, apiSecret }, portfolioId);
          break;
        case 'Kraken':
          returnedAssets = await krakenServices().getBalance({ apiKey, apiSecret });
          returnedOrderHistory = await krakenServices().getOderHistory({ apiKey, apiSecret }, portfolioId);
          break;
        default:
          console.log('There is no such api');
          break;
      }

      return { returnedAssets, returnedOrderHistory };
    } catch (e) {
      return { error: { response: e, message: 'Could not fetch account balance. Probably due to invalid API key.' } };
    }
  };

  const addAssetsToPortfolio = async (assetsFromApi, portfolioId) => {
    try {
      const formatedAssets = Object.keys(assetsFromApi).map(property => ({
        currency: assetsFromApi[property].currency,
        balance: assetsFromApi[property].balance,
        origin: assetsFromApi[property].origin,
        portfolioId,
      }));

      await repository.createMany({ modelName: 'Asset', newObjects: formatedAssets });
    } catch (error) {
      return error;
    }
  };

  const addTradeHistoryToPortfolio = async (orderHistoryFromApi) => {
    try {
      if (orderHistoryFromApi.length > 0) {
        await repository.createMany({ modelName: 'ApiTradeHistory', newObjects: orderHistoryFromApi });
      }
    } catch (error) {
      return error;
    }
  };

  const syncPortfolioAssets = async (apiName, portfolioId, currentPortfolioApiAssets, index) => {
    // Get User Assets from database
    const currentPortfolioAssets = await repository.find({
      modelName: 'Asset',
      options: {
        where: {
          origin: apiName,
          portfolioId,
        },
        raw: true,
      },
    });

    if (currentPortfolioAssets) {
      // Compare Assets
      const resultAssets = currentPortfolioApiAssets[index].reduce((accumulator, currentValue) => {
        if (currentValue.origin === apiName) {
          return accumulator + parseFloat(currentValue.balance);
        }
        return accumulator;
      }, 0);

      const resultPortfolioAssets = currentPortfolioAssets.reduce((accumulator, currentValue) => {
        if (currentValue.origin === apiName) {
          return accumulator + parseFloat(currentValue.balance);
        }
        return accumulator;
      }, 0);


      // Add new Assets
      if ((resultAssets !== resultPortfolioAssets)
        || (currentPortfolioApiAssets[index].length !== currentPortfolioAssets.length)) {
        await repository.removeAll({
          modelName: 'Asset',
          options: {
            origin: apiName,
            portfolioId,
          },
        });

        await addAssetsToPortfolio(currentPortfolioApiAssets[index], portfolioId);

        const updatedAssets = await repository.find({
          modelName: 'Asset',
          options: {
            where: {
              portfolioId,
            },
            raw: true,
          },
        });

        return updatedAssets;
      }

      return null;
    }

    return null;
  };

  const syncPortfolioHistory = async (apiName, portfolioId, currentPortfolioApiHistory) => {
    // Get User Api History from database
    const lastAddedTradeHistory = await repository.findOne({
      modelName: 'ApiTradeHistory',
      options: {
        where: {
          source: apiName,
          portfolioId,
        },
        order: [['time', 'DESC']],
      },
    });

    const newerApiHistoryToAdd = currentPortfolioApiHistory.map((api) => {
      return api.filter(transaction =>
        (new Date(lastAddedTradeHistory.time).getTime() < new Date(transaction.time).getTime()));
    });


    // Add newer Api History
    let updated = 0;
    // eslint-disable-next-line
    (async () => {
      await Promise.all(newerApiHistoryToAdd.map(async (apiHistory) => {
        if (apiHistory.length > 0) {
          updated += 1;
          await addTradeHistoryToPortfolio(apiHistory);
        }
      }));
    })();

    if (updated > 0) {
      const updatedHistory = await repository.find({
        modelName: 'ApiTradeHistory',
        options: {
          where: {
            portfolioId,
          },
        },
      });

      return updatedHistory;
    }

    return null;
  };

  return {
    updateClosingTime,
    verifiedPatchUserMetadata,
    patchUserMetadata,
    deleteUserMetadata,
    syncUserApiData,
  };
};

module.exports = userController;
