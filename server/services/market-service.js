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
    const { hour = '*', minute = '*', second = '*' } = time;
    return new CronJob({
      cronTime: `${second} ${minute} ${hour} * * *`,
      onTick: () => {
        console.log(`CRON START...................................................................... ${new Date()}`);
        marketFunction();
      },
      start: true,
      timeZone: 'Europe/London',
    });
  };

  return {
    syncTickersFromCoinMarketCap,
    createMarketJob,
  };
};

module.exports = marketService;
