const { CronJob } = require('cron');
const { coinMarketCapServices } = require('../integrations/coinMarketCap-services');

const marketService = (repository) => {
  const syncTickersFromCoinMarketCap = async (convertCurrency = 'ETH') => {
    try {
      const tickers = await coinMarketCapServices().getTickers(convertCurrency);

      await repository.removeAll({ modelName: 'CoinMarketCapCurrency' });
      repository.createMany({ modelName: 'CoinMarketCapCurrency', newObjects: tickers });
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
    syncTickersFromCoinMarketCap,
    createMarketJob,
  };
};

module.exports = marketService;
