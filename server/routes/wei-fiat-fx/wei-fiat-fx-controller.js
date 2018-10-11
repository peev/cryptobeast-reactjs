const { responseHandler } = require('../utilities/response-handler');
const { etherScanServices } = require('../../integrations/etherScan-services');
const { krakenServices } = require('../../integrations/kraken-services');

const modelName = 'WeiFiatFx';

const weiFiatFxController = (repository) => {
  const createWeiFiatFx = async (req, res) => {
    const weiFiatFxData = req.body;
    let priceUsdValue;

    const ethPrice = await etherScanServices().getETHUSDPrice();

    // TODO continue
    const testTickers = await krakenServices().getPair('ETHJPY');
    testTickers.then(result => console.log(result));

    switch (weiFiatFxData.fxName) {
      case 'ETC':
        priceUsdValue = ethPrice;
        break;
      default:
        await repository.findOne({ modelName: 'MarketSummary', options: { where: { MarketName: `ETH-${weiFiatFxData.fxName}` } } })
          .then((foundSummary) => {
            priceUsdValue = ethPrice * foundSummary.dataValues.Last;
          })
          .catch((error) => {
            res.json(error);
          });
        break;
    }

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

  const updateWeiFiatFx = (req, res) => {
    const { id } = req.params;
    const weiFiatFxData = Object.assign({}, req.body, { id });
    repository.update({ modelName, updatedRecord: weiFiatFxData })
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

  return {
    createWeiFiatFx,
    getWeiFiatFx,
    updateWeiFiatFx,
    removeWeiFiatFx,
  };
};

module.exports = weiFiatFxController;
