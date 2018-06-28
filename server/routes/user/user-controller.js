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
      switch (req.body.user_metadata.uploadApi.exchange) {
        case 'Bittrex':
          await bittrexServices().getBalance({
            apiKey: req.body.user_metadata.uploadApi.apiKey,
            apiSecret: req.body.user_metadata.uploadApi.apiSecret,
          });
          break;
        case 'Kraken':
          await krakenServices().getBalance({
            apiKey: req.body.user_metadata.uploadApi.apiKey,
            apiSecret: req.body.user_metadata.uploadApi.apiSecret,
          });
          break;
        default:
          console.log('There is no such api');
          break;
      }

      // res.status(200).send({ isSuccessful: true }); userMetadata
      const returnedUser = await Auth0ManagementApi.patchUser(req, res);
      await addAssetFromApi(returnedUser.user_metadata, req.user.email);

      return returnedUser;
    } catch (error) {
      res.status(200).send({ isSuccessful: false, error });
    }
  };

  const addAssetFromApi = async (userMetadata, userEmail) => {
    try {
      // console.log('----------------searchItemsInCurrentPortfolio111', userMetadata);
      await Object.keys(userMetadata).forEach(async (apiData) => {
        // req is account object with apiKey, apiSecret and foreign key portfolioId
        // TODO: switch between apis
        if (apiData.includes('api_account')) {
          if (userMetadata[apiData].exchange) {
            let returnedAssets;
            let formatedAssets;
            switch (userMetadata[apiData].exchange) {
              case 'Bittrex':
                returnedAssets = await bittrexServices().getBalance({
                  apiKey: userMetadata[apiData].apiKey,
                  apiSecret: userMetadata[apiData].apiSecret,
                });
                break;
              case 'Kraken':
                returnedAssets = await krakenServices().getBalance({
                  apiKey: userMetadata[apiData].apiKey,
                  apiSecret: userMetadata[apiData].apiSecret,
                });
                break;
              default:
                console.log('There is no such api');
                break;
            }

            const allProfilesFound = await repository.find({
              modelName,
              options: {
                where: { owner: userEmail },
                attributes: ['id'],
              },
            });

            allProfilesFound.forEach((userPortfolio) => {
              formatedAssets = Object.keys(returnedAssets).map(property => ({
                currency: returnedAssets[property].currency,
                balance: returnedAssets[property].balance,
                origin: returnedAssets[property].origin,
                portfolioId: userPortfolio.id,
              }));
            });


            // console.log('----------------searchItemsInCurrentPortfolio', allProfilesFound);
            console.log('----------------addAssetFromApi', allProfilesFound, returnedAssets, formatedAssets);
            // map the DTO??? to database

            await repository.createMany({ modelName: 'Asset', newObjects: formatedAssets });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const patchUserMetadata = async (req, res) => Auth0ManagementApi.patchUser(req, res);

  return {
    updateClosingTime,
    verifiedPatchUserMetadata,
    patchUserMetadata,
  };
};

module.exports = userController;
