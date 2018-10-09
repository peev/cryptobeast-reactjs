const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiCurrency';

const weiCurrencyController = (repository) => {
  const createWeiCurrency = (req, res) => {
    const weiCurrencyData = req.body;
    repository.create({ modelName,
      newObject: {
        tokenId: weiCurrencyData.id,
        tokenName: weiCurrencyData.name,
        tokenNameLong: weiCurrencyData.fullName,
        lastPriceETH: weiCurrencyData.lastPriceETH,
      },
    })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
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

  const updateWeiCurrency = (req, res) => {
    const { id } = req.params;
    const weiCurrencyData = Object.assign({}, req.body, { id });
    repository.update({ modelName, updatedRecord: weiCurrencyData })
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
