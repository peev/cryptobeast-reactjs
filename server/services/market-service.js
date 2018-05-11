const { CronJob } = require('cron');
const { krakenServices } = require('../integrations/kraken-services');
const { bittrexServices } = require('../integrations/bittrex-services');

const marketService = (repository) => {
  const syncSummaries = async () => {
    const newSummaries = await bittrexServices().getSummaries();
    repository.createMany({ modelName: 'MarketSummaryHistory', newObjects: newSummaries });

    await repository.removeAll({ modelName: 'MarketSummary' });
    return repository.createMany({ modelName: 'MarketSummary', newObjects: newSummaries });
  }

  const syncTickersFromKraken = async (currenciesToGet) => {
    const baseCurrencies = currenciesToGet || 'XETHXXBT,XXBTZEUR,XXBTZJPY,XXBTZUSD';
    const tickers = await krakenServices().getTickers(baseCurrencies);
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
    repository.createMany({ modelName: 'TickerHistory', newObjects: currentTickerPairs });

    await repository.removeAll({ modelName: 'Ticker' });
    return repository.createMany({ modelName: 'Ticker', newObjects: currentTickerPairs });
  }

  const syncCurrenciesFromApi = async () => {
    await repository.removeAll({ modelName: 'Currency' });
    const currencies = await bittrexServices().getCurrencies();

    return repository.createMany({ modelName: 'Currency', newObjects: currencies });
  }

  const createMarketJob = (marketFunction, time) => {
    // const time = { second: 1 } // every first second of each minute
    const { hour = '*', minute = '*', second = '*' } = time;
    const job = new CronJob(`${second} ${minute} ${hour} * * *`, () => {
      marketFunction();
    }, () => {
      /* This function is executed when the job stops */
      console.log('Save closing share price job stopped!');
    }, true, /* Start the job right now */
      // timeZone /* Time zone of this job. */
    );
    return job;
  };

  return {
    syncSummaries,
    syncTickersFromKraken,
    syncCurrenciesFromApi,
    createMarketJob,
  };
};

module.exports = marketService;
