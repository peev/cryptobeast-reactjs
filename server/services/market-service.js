const { CronJob } = require('../node_modules/cron');
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

  const createCronJob = marketFunction =>
    new CronJob('00,10,20,30,40,50 * * * *', () => {
      console.log(`CRON START: ${new Date()}`);
      return marketFunction();
    }, null, true, 'UTC');

  return {
    syncTickersFromCoinMarketCap,
    createCronJob,
  };
};

module.exports = marketService;
