// const { krakenServices } = require('../../integrations/kraken-services');
const { bittrexServices } = require('../../integrations/bittrex-services');

const marketController = (repository) => {
  const getSummaries = (req, res) => {
    repository.market.updateSummary()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getBaseCurrencies = (req, res) => {
    repository.market.getBase()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  // Ticker services ======================================================
  const syncTickersFromApi = (req, res) => {
    bittrexServices().getAllTickers(repository)
      .then((tickers) => {
        return repository.ticker.syncTickers(tickers);
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });

    // kraken version with 60 markets vs bittrex with 260 markets =========
    // krakenServices().getAllTickers().then((tickersFromApi) => {
    //   repository.ticker.syncTickers(tickersFromApi)
    //     .then((response) => {
    //       res.status(200).send(response);
    //     })
    //     .catch((error) => {
    //       res.json(error);
    //     });
    // });
  };

  const getAllTickers = (req, res) => {
    repository.ticker.getAll()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  return {
    getSummaries,
    getBaseCurrencies,
    getAllTickers,
    syncTickersFromApi,
  };
};

module.exports = marketController;
