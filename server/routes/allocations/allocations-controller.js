const allocationsController = (repository) => {
  const marketService = require('../../services/market-service')(repository);
  const modelName = 'Allocation';

  const getAllocations = (req, res) => {
    const { fxName } = req.params;
    repository.findById({ modelName, fxName })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const createAllocations = async (weiFiatFxData) => {
    return repository.create({ modelName, newObject: weiFiatFxData })
      .then((response) => {
        console.log(response);
      })
      .catch(error => console.log(error));
  };

  const sync = async (req, res) => {
    const worldCurrencies = await marketService.getTickersFromCurrencyLayerApi().catch(err => {
      console.log(err)
    });
    let date = new Date();
    worldCurrencies.forEach(async (currency, index) => {
      let promise = createFiatFx({
        fxName: currency.pair.replace('USD', ''),
        priceUSD: currency.last,
        createdAt: +date
      });
      if (index === worldCurrencies.length - 1) {
        promise.then(() => {
          res.status(200).send({
            status: 'success'
          });
        });
      }
    });
  };

  return {
    createAllocations,
    getAllocations,
    sync
  };
};

module.exports = allocationsController;
