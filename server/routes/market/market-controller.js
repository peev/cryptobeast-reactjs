const { krakenServices } = require('../../integrations/kraken-services');
const { bittrexServices } = require('../../integrations/bittrex-services');

const marketController = (repository) => {
  const syncSummaries = (req, res) => {
    const clearOldSummariesPromise = repository.removeAll({ modelName: 'MarketSummary' });
    const getSummariesPromise = clearOldSummariesPromise
      .then(() => bittrexServices().getSummaries());

    Promise.resolve(getSummariesPromise)
      .then((currencies) => {
        return repository.createMany({ modelName: 'MarketSummary', newObjects: currencies });
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getSummaries = (req, res) => {
    repository.find({ modelName: 'MarketSummary' })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getBaseCurrencies = (req, res) => {
    repository.find({ modelName: 'Ticker', options: { where: { pair: ['USD', 'EUR', 'JPY', 'ETH'] } } })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
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
        return repository.createMany({ modelName: 'Ticker', newObjects: currentTickerPairs })
          .then(result => result);
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
    const clearOldTickersPromise = repository.removeAll({ modelName: 'Ticker' });
    const getTickersPromise = clearOldTickersPromise
      .then(() => bittrexServices().getAllTickers());

    Promise.resolve(getTickersPromise)
      .then((tickers) => {
        return repository.createMany({ modelName: 'Ticker', newObjects: tickers });
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
    repository.find({ modelName: 'Ticker' })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const syncCurrenciesFromApi = (req, res) => {
    const clearOldCurrenciesPromise = repository.removeAll({ modelName: 'Currency' });
    const getCurrenciesPromise = clearOldCurrenciesPromise
      .then(() => bittrexServices().getCurrencies());

    Promise.resolve(getCurrenciesPromise)
      .then((currencies) => {
        return repository.createMany({ modelName: 'Currency', newObjects: currencies });
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(404).json(error);
      });
  };

  const getAllCurrencies = (req, res) => {
    repository.find({ modelName: 'Currency' })
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
