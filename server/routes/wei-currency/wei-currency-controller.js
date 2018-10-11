const { responseHandler } = require('../utilities/response-handler');

const modelName = 'WeiCurrency';

const weiCurrencyController = (repository) => {
  const createWeiCurrency = async (req, res) => {
    const weiCurrencyData = req.body;

    const newWeiCurrencyObject = {
      tokenId: weiCurrencyData.id,
      tokenName: weiCurrencyData.name,
      tokenNameLong: weiCurrencyData.fullName,
      lastPriceETH: weiCurrencyData.lastPriceETH,
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
        res.status(200).send(currency);
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
