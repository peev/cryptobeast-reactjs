const userController = (repository, jobs) => {
  const { closingSharePriceJobs, openingSharePriceJobs, closingPortfolioCostJobs } = jobs;
  const { bittrexServices } = require('../../integrations/bittrex-services');
  const { krakenServices } = require('../../integrations/kraken-services');
  const portfolioService = require('../../services/portfolio-service')(repository);
  const AManagement = require('./../../services/Auth0ManagementAPI');

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
      let returnedAssets;
      switch (exchange) {
        case 'Bittrex':
          returnedAssets = await bittrexServices().getBalance({ apiKey, apiSecret });
          break;
        case 'Kraken':
          returnedAssets = await krakenServices().getBalance({ apiKey, apiSecret });
          break;
        default:
          console.log('There is no such api');
          break;
      }

      if (returnedAssets) {
        await addAssetsToPortfolio(returnedAssets, portfolioId);
        const returnedUser = await Auth0ManagementApi.patchUser(req, res);

        return returnedUser;
      }

      return res.status(200).send({ isSuccessful: false, message: 'No assets found' });
    } catch (error) {
      res.status(200).send({ isSuccessful: false, error });
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

  //  Utility functions
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
      console.log(error);
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
