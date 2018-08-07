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
    // Validations
    if (!req.body.user_metadata) {
      return res.status(400).send({ isSuccessful: false, message: 'No user metadata found' });
    }
    if (!req.body.user_metadata.api.exchange
      || req.body.user_metadata.api.exchange === ''
      || typeof req.body.user_metadata.api.exchange !== 'string') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid exchange' });
    }
    if (!req.body.user_metadata.api.apiKey
      || req.body.user_metadata.api.apiKey === ''
      || typeof req.body.user_metadata.api.apiKey !== 'string') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid apiKey' });
    }
    if (!req.body.user_metadata.api.apiSecret
      || req.body.user_metadata.api.apiSecret === ''
      || typeof req.body.user_metadata.api.apiSecret !== 'string') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid apiSecret' });
    }
    if (!req.body.user_metadata.api.portfolioId
      || req.body.user_metadata.api.portfolioId === ''
      || typeof req.body.user_metadata.api.portfolioId !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid portfolioId' });
    }

    try {
      const { exchange, apiKey, apiSecret, portfolioId } = req.body.user_metadata.api;

      // Check user api key and secret, be requesting account balance
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

      if (returnedAssets) {
        // Add given api key and secret to auth0
        const returnedUser = await Auth0ManagementApi.patchUser(req, res);

        // Add found balance to current selected portfolio
        await addAssetsToPortfolio(returnedAssets, portfolioId); // eslint-disable-line

        // Add found trade history to current selected portfolio
        await addTradeHistoryToPortfolio(returnedOrderHistory); // eslint-disable-line

        console.log(returnedOrderHistory); // for testing api response

        return returnedUser;
      }

      return res.status(200).send({ isSuccessful: false, message: 'No assets found' });
    } catch (error) {
      return res.status(404).send({ isSuccessful: false, message: error });
    }
  };


  const patchUserMetadata = async (req, res) => {
    // Validations
    if (!req.body.user_metadata) {
      return res.status(200).send({ isSuccessful: false, message: 'No user metadata found' });
    }
    if (!req.body.user_metadata.api.id
      || req.body.user_metadata.api.id === ''
      || typeof req.body.user_metadata.api.id !== 'string') {
      return res.status(200).send({ isSuccessful: false, message: 'Invalid api id' });
    }

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

  // TODO: Normalize returned data to match DB model
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

  // TODO: Normalize returned data to match DB model
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
  };
};

module.exports = userController;
