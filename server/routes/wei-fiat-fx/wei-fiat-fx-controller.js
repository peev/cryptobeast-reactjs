const { weiFiatFxService } = require('./wei-fiat-fx-service');
const { responseHandler } = require('../utilities/response-handler');
const { krakenServices } = require('../../integrations/kraken-services');
const { etherScanServices } = require('../../integrations/etherScan-services');

const modelName = 'WeiFiatFx';

const weiFiatFxController = (repository) => {
  const marketService = require('../../services/market-service')(repository);

  const createWeiFiatFx = async (req, res) => {
    const weiFiatFxData = req.body;
    let priceUsdValue = await weiFiatFxService.getPriceByType(weiFiatFxData.fxName)

    const newWeiFiatFxObject = {
      fxName: weiFiatFxData.fxName,
      fxNameLong: weiFiatFxData.fxNameLong,
      priceUSD: priceUsdValue,
    };

    await repository.findOne({
      modelName,
      options: {
        where: {
          fxName: weiFiatFxData.fxName,
        },
      },
    }).then((fiatFx) => {
      if (fiatFx === null) {
        repository.create({ modelName, newObject: newWeiFiatFxObject })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((error) => {
            res.json(error);
          });
      } else {
        const newWeiPortfolioData = Object.assign({}, newWeiFiatFxObject, { id: fiatFx.id });
        repository.update({ modelName, updatedRecord: newWeiPortfolioData })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch(error => res.json(error));
      }
    }).catch((error) => {
      res.json(error);
    });
  };

  const getWeiFiatFx = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updateWeiFiatFx = async (req, res) => {
    const { id } = req.params;
    const weiFiatFxData = req.body;
    let priceUsdValue;

    const ethPrice = await etherScanServices().getETHUSDPrice();

    switch (weiFiatFxData.fxName) {
      case 'ETH':
        priceUsdValue = ethPrice;
        break;
      default:
        await marketService.getTickersFromKraken(`XETHZ${weiFiatFxData.fxName}`)
          .then((data) => {
            priceUsdValue = data[0].last / ethPrice;
          })
          .catch(err => console.log(err));
        break;
    }

    const newWeiFiatFxObject = {
      fxName: weiFiatFxData.fxName,
      fxNameLong: weiFiatFxData.fxNameLong,
      priceUSD: priceUsdValue,
    };

    const newWeiPortfolioData = Object.assign({}, newWeiFiatFxObject, { id });
    repository.update({ modelName, updatedRecord: newWeiPortfolioData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const removeWeiFiatFx = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };
  
  const sync = () => {
    repository.find({ modelName }).then((currencies) => {
      // Update the usd price of all currencies
      currencies.forEach((currency) => {
        let priceUsdValue = await weiFiatFxService.getPriceByType(currency.fxName);
        repository.update(
          { 
            modelName, 
            updatedRecord: {
              id: currency.id
              priceUSD: priceUsdValue
            } 
          })
          .then((response) => {
            // TODO: Handle the response based on all items on all controllers ready
          })
          .catch(error => res.json(error));
      });
    });
  };

  return {
    createWeiFiatFx,
    getWeiFiatFx,
    updateWeiFiatFx,
    removeWeiFiatFx,
    sync
  };
};

module.exports = weiFiatFxController;
