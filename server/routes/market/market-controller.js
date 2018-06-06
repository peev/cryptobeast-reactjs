// const { krakenServices } = require('../../integrations/kraken-services');
// const { bittrexServices } = require('../../integrations/bittrex-services');

const marketController = (repository) => {
  const marketService = require('../../services/market-service')(repository);

  const syncSummariesOnRequest = (req, res) => {
    marketService.syncSummaries()
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

  const syncTickersFromKrakenOnRequest = (req, res) => {
    const { currencies } = req.body;
    marketService.syncTickersFromKraken(currencies)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const syncTickersFromCoinMarketCapOnRequest = (req, res) => {
    const { convertCurrency } = req.body;
    marketService.syncTickersFromCoinMarketCap(convertCurrency)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const getAllMarketPriceHistory = (req, res) => {
    repository.find({ modelName: 'MarketPriceHistory' })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  // Ticker services ======================================================
  /**
 * @deprecated too slow -> use market summary
 */
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

  const syncCurrenciesFromApiOnRequest = (req, res) => {
    marketService.syncCurrenciesFromApi()
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

  const getBaseTickersHistory = (req, res) => {
    const { fromDate } = req.body;
    const { toDate } = req.body;
    const query = `select * from public.ticker_history 
                   where "pair" = 'USD' 
                   and CAST("createdAt" as VarChar) like '%23:%'::text
                   and "createdAt" between '${fromDate}' and '${toDate}'`;
    repository.rawQuery({ query })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  return {
    syncSummariesOnRequest,
    getSummaries,
    getBaseCurrencies,
    syncTickersFromApi,
    getAllTickers,
    syncCurrenciesFromApiOnRequest,
    syncTickersFromCoinMarketCapOnRequest,
    getAllMarketPriceHistory,
    getAllCurrencies,
    syncTickersFromKrakenOnRequest,
    getBaseTickersHistory,
  };
};

module.exports = marketController;
