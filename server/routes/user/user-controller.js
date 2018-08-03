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
      const { returnedAssets, returnedOrderHistory } = await getUserApiData(exchange, apiKey, apiSecret, portfolioId);

      if (returnedAssets) {
        // Add given api key and secret to auth0
        const returnedUser = await Auth0ManagementApi.patchUser(req, res);

        // Add found balance to current selected portfolio
        await addAssetsToPortfolio(returnedAssets, portfolioId);

        // Add found trade history to current selected portfolio
        await addTradeHistoryToPortfolio(returnedOrderHistory);

        return returnedUser;
      }

      return res.status(200).send({ isSuccessful: false, message: 'No assets found' });
    } catch (error) {
      return res.status(404).send({ isSuccessful: false, message: error });
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


    // Get User Data from database
    const currentPortfolioAssets = await repository.find({
      modelName: 'Asset',
      options: { where: { portfolioId } },
    });


    // Compare values
    let resultAssets;
    let resultPortfolioAssets;
    let newerApiHistoryToAdd;
    currentPortfolioApis.forEach(async (apiName) => {
      resultAssets = currentPortfolioApiAssets[0].reduce((accumulator, currentValue) => {
        if (currentValue.origin === apiName) {
          // console.log('<<<', currentValue, currentValue.origin, apiName);
          return accumulator + parseFloat(currentValue.balance);
        }
        return accumulator;
      }, 0);

      resultPortfolioAssets = currentPortfolioAssets.reduce((accumulator, currentValue) => {
        if (currentValue.origin === apiName) {
          // console.log('>>>', accumulator, currentValue.balance, currentValue.origin);
          return accumulator + parseFloat(currentValue.balance);
        }
        return accumulator;
      }, 0);


      // ==================
      const lastAddedTradeHistory = await repository.findOne({
        modelName: 'ApiTradeHistory',
        options: {
          where: {
            portfolioId,
            source: apiName,
          },
          order: [['time', 'DESC']],
        },
      });

      newerApiHistoryToAdd = currentPortfolioApiHistory.map(async (api) => {
        return api.filter((transaction) => {
          if (new Date(lastAddedTradeHistory.time).getTime() < new Date(transaction.time).getTime()) {
            return transaction;
          }
        });
      });

      // const resultPortfolioHistory = currentPortfolioHistory.reduce((accumulator, currentValue) => {
      //   if (currentValue.source === apiName) {
      //     console.log('>>>', currentValue, currentValue.source, apiName);
      //     return accumulator + parseFloat(currentValue.volume);
      //   }
      //   return accumulator;
      // }, 0);

      // console.log('<<>>', resultAssets, resultPortfolioAssets);
      // console.log('<<>>', newerApiHistoryToAdd);
    });


    // Update
    // console.log('<<>>', resultAssets);
    // console.log('<<>>', resultPortfolioAssets);
    // console.log('<<>>', newerApiHistoryToAdd);
    newerApiHistoryToAdd.map((el) => {
      console.log(el);
    })
    // console.log('<<>>', currentPortfolioApiAssets[0].length, currentPortfolioAssets.length);
    // console.log('<<>>', currentPortfolioApiHistory);

    // console.log(returnedAssets, returnedOrderHistory);

    return res.status(200).send({ isSuccessful: true, message: 'Assets updated' });
  };

  //  Utility functions
  const getUserApiData = async (exchange, apiKey, apiSecret, portfolioId) => {
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

  return {
    updateClosingTime,
    verifiedPatchUserMetadata,
    patchUserMetadata,
    deleteUserMetadata,
    syncUserApiData,
  };
};

module.exports = userController;

// userController().syncUserApiData();