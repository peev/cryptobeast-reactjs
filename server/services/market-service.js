const { CronJob } = require('../node_modules/cron');
const cron = require('node-cron');
const { coinMarketCapServices } = require('../integrations/coinMarketCap-services');

const marketService = (repository) => {
  const syncTickersFromCoinMarketCap = async () => {
    try {
      const tickers = await coinMarketCapServices().getTickers('ETH');
      await console.log(`DB INSERT START ${new Date()}`);
      await repository.removeAll({ modelName: 'CoinMarketCapCurrency' });
      await repository.createMany({ modelName: 'CoinMarketCapCurrency', newObjects: tickers });
      await console.log(`DB INSERT END ${new Date()}`);
    } catch (error) {
      console.log(error);
    }
  };

  const createCronJob = marketFunction =>
    new CronJob('00,10,20,30,40,50 * * * *', () => {
      console.log(`CRON START: ${new Date()}`);
      return marketFunction();
    }, null, true);

  const createNodeCron = (marketFunction, time) =>
    cron.schedule(time, () => {
      console.log(`CRON START: ${new Date()}`);
      return marketFunction();
    });

  return {
    syncTickersFromCoinMarketCap,
    createCronJob,
    createNodeCron,
  };
};

module.exports = marketService;
