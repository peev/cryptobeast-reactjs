const marketController = (repository) => {
  const modelName = 'CoinMarketCapCurrency';
  const commonService = require('../../services/common-methods-service')();
  const intReqService = require('../../services/internal-requeter-service')(repository);

  const getTickersFromCoinMarketCap = async (req, res) =>
    repository.find({
      modelName,
    })
      .then(response => res.status(200).send(response))
      .catch(error => res.json(error));

  const getEthToUsd = async (req, res) => {
    const timestamp = new Date().getTime();
    const ethToUsd = await commonService.getEthToUsd(timestamp);
    if (ethToUsd !== null && ethToUsd !== undefined) {
      return res.status(200).send(ethToUsd.toString());
    }
    return res.status(400).send(null);
  };

  const closest = (num, arr) => {
    let curr = arr[0];
    for (let i = 0; i < arr.length; i += 1) {
      if (Math.abs(num - arr[i].createdAt) < Math.abs(num - curr.createdAt)) {
        curr = arr[i];
      }
    }
    return curr;
  };

  const getEthHistory = async (req, res) => {
    const { portfolioId } = req.params;

    try {
      const firstAllocation = await intReqService.getFirstAllocationByPortfolioId(portfolioId);
      const start = new Date(firstAllocation.timestamp).getTime();
      const end = new Date().getTime();
      const timestampsMiliseconds = commonService.calculateDays(commonService.getEndOfDay(start), commonService.getEndOfDay(end));
      const ethHistory = await commonService.getEthHistoryDayValue(timestampsMiliseconds[0], timestampsMiliseconds[timestampsMiliseconds.length - 1]);
      const ethPriceHistory = commonService.defineEthHistory(timestampsMiliseconds, ethHistory);
      return res.status(200).send(ethPriceHistory);
    } catch (error) {
      return res.status(400).send(error);
    }
  };

  return {
    getTickersFromCoinMarketCap,
    getEthToUsd,
    getEthHistory,
  };
};

module.exports = marketController;
// const { krakenServices } = require('../../integrations/kraken-services');
// const { bittrexServices } = require('../../integrations/bittrex-services');

const marketController = (repository) => {
  const marketService = require('../../services/market-service')(repository);
  //TODO: Used to respond with mock. Delete when approved
  const historyMockData = require('../../mocks/analytics-mock.json');
  const correlationMatrixMockData = require('../../mocks/correlation-matrix.json');

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
                   and CAST("createdAt" as VarChar) like '%23:00:59%'::text
                   and "createdAt" between '${fromDate}' and '${toDate}'`;
    repository.rawQuery({ query })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };
  
  const getProfitAndLossHistory = (req, res) => {
    // TODO: Make it working not as mock up
    res.status(200).send(historyMockData);
  };
  
  const getLiquidityHistory = (req, res) => {
    // TODO: Make it working not as mock up
    res.status(200).send({
      working: true
    });
  };

  const getCorrelationMatrixHistory = (req, res) => {
    // TODO: Make it working not as mock up
    res.status(200).send(correlationMatrixMockData);
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
    getProfitAndLossHistory,
    getLiquidityHistory,
    getCorrelationMatrixHistory
  };
};

module.exports = marketController;
