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

  const createNodeCron = (marketFunction, time) =>
    cron.schedule(time, () => {
      console.log(`CRON START: ${new Date()}`);
      return marketFunction();
    });

  return {
    syncTickersFromCoinMarketCap,
    createNodeCron,
  };
};

module.exports = marketService;
