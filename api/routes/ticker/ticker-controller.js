const { krakenServices } = require('../../integrations/kraken-services');

const tickerController = (repository) => {
  const syncTickersFromWebApi = (req, res) => {
    krakenServices().getAllTickers().then((tickersFromApi) => {
      repository.ticker.syncTickers(tickersFromApi)
        .then((response) => {
          res.status(200).send(response);
        })
        .catch((error) => {
          res.json(error);
        });
    });
  };

  return {
    syncTickersFromWebApi,
  };
};

module.exports = tickerController;
