const { krakenServices } = require('../../integrations/kraken-services');
const { bittrexServices } = require('../../integrations/bittrex-services');

const marketController = (repository) => {
  const syncSummaries = (req, res) => {
    bittrexServices().getSummaries()
      .then((summaries) => {
        return repository.market.updateSummary(summaries);
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getSummaries = (req, res) => {
    repository.market.getAll()
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

    // Bittrex variant
    // repository.market.getBase()
    //   .then((response) => {
    //     res.status(200).send(response);
    //   })
    //   .catch((error) => {
    //     res.json(error);
    //   });
  };

  const syncTickersFromKraken = (req, res) => {
    const currenciesToGet = req.body.currencies;
    krakenServices().getTickers(currenciesToGet)
      .then((tickers) => {
        const currencyDictionary = {
          XETHXXBT: 'ETH',
          XXBTZEUR: 'EUR',
          XXBTZJPY: 'JPY',
          XXBTZUSD: 'USD',
        };
        const currentTickerPairs = [];

        Object.keys(tickers).map((currency) => {
          currentTickerPairs.push({
            pair: currencyDictionary[currency],
            last: tickers[currency].c[0],
          });
        });

        return repository.ticker.saveManyTickers(currentTickerPairs).then(result => result);
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  // Ticker services ======================================================
  const syncTickersFromApi = (req, res) => {
    bittrexServices().getAllTickers()
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

  const syncCurrenciesFromApi = (req, res) => {
    bittrexServices().getCurrencies()
      .then((currencies) => {
        return repository.currency.syncCurrencies(currencies);
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getAllCurrencies = (req, res) => {
    repository.currency.getAll()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  return {
    syncSummaries,
    getSummaries,
    getBaseCurrencies,
    syncTickersFromApi,
    getAllTickers,
    syncCurrenciesFromApi,
    getAllCurrencies,
    syncTickersFromKraken,
  };
};

module.exports = marketController;