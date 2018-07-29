const { CronJob } = require('cron');
const { krakenServices } = require('../integrations/kraken-services');
const { bittrexServices } = require('../integrations/bittrex-services');
const { coinMarketCapServices } = require('../integrations/coinMarketCap-services');

const marketService = (repository) => {
  const syncSummaries = async () => {
    try {
      const newSummaries = await bittrexServices().getSummaries();

      await repository.removeAll({ modelName: 'MarketSummary' });
      repository.createMany({ modelName: 'MarketSummary', newObjects: newSummaries });
    } catch (error) {
      console.log(error);
    }
  };

  const saveSummariesToHistory = async () => {
    try {
      const newSummaries = await bittrexServices().getSummaries();
      repository.createMany({ modelName: 'MarketSummaryHistory', newObjects: newSummaries });
    } catch (error) {
      console.log(error);
    }
  };

  const getTickersFromKraken = async (currenciesToGet) => {
    const baseCurrencies = currenciesToGet || 'XETHXXBT,XXBTZEUR,XXBTZJPY,XXBTZUSD';
    const currencyDictionary = {
      XETHXXBT: 'ETH',
      XXBTZEUR: 'EUR',
      XXBTZJPY: 'JPY',
      XXBTZUSD: 'USD',
    };
    const tickers = await krakenServices().getTickers(baseCurrencies);
    const currentTickerPairs = [];
    Object.keys(tickers).forEach((currency) => {
      currentTickerPairs.push({
        pair: currencyDictionary[currency],
        last: tickers[currency].c[0],
      });
    });

    return currentTickerPairs;
  };

  const syncTickersFromKraken = async (currenciesToGet) => {
    const currentTickerPairs = await getTickersFromKraken(currenciesToGet);
    await repository.removeAll({ modelName: 'Ticker' });

    return repository.createMany({ modelName: 'Ticker', newObjects: currentTickerPairs });
  };

  const saveTickersFromKrakenToHistory = async (currenciesToGet) => {
    const currentTickerPairs = await getTickersFromKraken(currenciesToGet);

    return repository.createMany({ modelName: 'TickerHistory', newObjects: currentTickerPairs });
  };

  const syncTickersFromCoinMarketCap = async (convertCurrency = 'BTC') => {
    const tickers = await coinMarketCapServices().getTickers(convertCurrency);

    await repository.removeAll({ modelName: 'MarketPriceHistory' });
    return repository.createMany({ modelName: 'MarketPriceHistory', newObjects: tickers });
  };

  const syncCurrenciesFromApi = async () => {
    try {
      const currencies = await bittrexServices().getCurrencies();

      await repository.removeAll({ modelName: 'Currency' });
      repository.createMany({ modelName: 'Currency', newObjects: currencies });
    } catch (error) {
      console.log(error);
    }
  };

  const createMarketJob = (marketFunction, time) => {
    // const time = { second: 1 } // every first second of each minute
    const { hour = '*', minute = '*', second = '*' } = time;

    return new CronJob({
      cronTime: `${second} ${minute} ${hour} * * *`,
      onTick: () => {
        marketFunction();
      },
      start: true,
      // timeZone: 'America/Los_Angeles',
    });
  };

  return {
    syncSummaries,
    saveSummariesToHistory,
    syncTickersFromKraken,
    saveTickersFromKrakenToHistory,
    syncTickersFromCoinMarketCap,
    syncCurrenciesFromApi,
    createMarketJob,
  };
};

module.exports = marketService;
