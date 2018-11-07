const fiatFxController = (repository) => {
  const marketService = require('../../services/market-service')(repository);
  const modelName = 'FiatFx';
  const currencyModelName = 'Currency';

  const getFiatFx = (req, res) => {
    const { fxName } = req.params;
    repository.findById({ modelName, fxName })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const createFiatFx = async (weiFiatFxData) => {
    return repository.create({ modelName, newObject: weiFiatFxData })
      .then((response) => {
        // console.log(response);
      })
      .catch(error => console.log(error));
  };

  const sync = async (req, res) => {
    // TODO: Fetch them from the DB. Only the microservise can fetch
    const allCurrencies = await repository.find({ modelName: currencyModelName });
    let worldCurrencies = [];
    allCurrencies.map((currency) => {
      let currencyData = currency.dataValues;
      if(worldCurrencies[currencyData.tokenName]) {
        if(+worldCurrencies[currencyData.tokenName].createdAt < +currencyData.createdAt) {
          worldCurrencies[currencyData.tokenName] = currencyData;
        }
      } else {
        worldCurrencies[currencyData.tokenName] = currencyData;
      }
    });
    Object.keys(worldCurrencies).forEach(async (key, index) => {
      let currency = worldCurrencies[key];
      if(!currency.pair) {
        console.log('Wrong currency format of: ', JSON.stringify(currency));
        return;
      }
      let promise = createFiatFx({
        fxName: currency.pair.replace('USD', ''),
        priceUSD: currency.last,
        createdAt: +date
      });
      if (index === worldCurrencies.length - 1) {
        return promise
      }
    });
  };

  return {
    createFiatFx,
    getFiatFx,
    sync,
  };
};

module.exports = fiatFxController;
