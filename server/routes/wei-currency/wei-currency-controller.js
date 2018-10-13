const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiCurrency';

const weiCurrencyController = (repository) => {
  const WeidexService = require('../../services/weidex-service')(repository);

  const createWeiCurrency = async (req, res) => {
    const weiCurrencyData = req.body;

    const priceResponse = await WeidexService.getTokenTicker(weiCurrencyData.id);

    const newWeiCurrencyObject = {
      tokenId: weiCurrencyData.id,
      tokenName: weiCurrencyData.name,
      tokenNameLong: weiCurrencyData.fullName,
      lastPriceETH: priceResponse.price,
      // bid: priceResponse.body.bid,
      // ask: priceResponse.body.ask,
    };

    await repository.findOne({
      modelName,
      options: {
        where: {
          tokenName: weiCurrencyData.name,
        },
      },
    }).then((currency) => {
      if (currency === null) {
        repository.create({ modelName, newObject: newWeiCurrencyObject })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((error) => {
            res.json(error);
          });
      } else {
        const newWeiCurrencyData = Object.assign({}, newWeiCurrencyObject, { id: currency.id });
        repository.update({ modelName, updatedRecord: newWeiCurrencyData })
          .then((response) => {
            res.status(200).send(response);
          })
          .catch(error => res.json(error));
      }
    }).catch((error) => {
      res.json(error);
    });
  };

  const getWeiCurrency = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updateWeiCurrency = async (req, res) => {
    const { id } = req.params;
    const weiCurrencyData = req.body;

    const priceResponse = await WeidexService.getTokenTicker(weiCurrencyData.id);

    const newWeiCurrencyObject = {
      tokenId: weiCurrencyData.id,
      tokenName: weiCurrencyData.name,
      tokenNameLong: weiCurrencyData.fullName,
      lastPriceETH: priceResponse.price,
      // bid: priceResponse.body.bid,
      // ask: priceResponse.body.ask,
    };

    const newWeiCurrencyData = Object.assign({}, newWeiCurrencyObject, { id });
    repository.update({ modelName, updatedRecord: newWeiCurrencyData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const removeWeiCurrency = (req, res) => {
    const { id } = req.params;
    repository.remove({ modelName, id })
      .then(result => responseHandler(res, result))
      .catch(error => res.json(error));
  };

  return {
    createWeiCurrency,
    getWeiCurrency,
    updateWeiCurrency,
    removeWeiCurrency,
  };
};

module.exports = weiCurrencyController;
