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
      console.log(`CRON START...................................................................... ${new Date()}`);
      console.log('You will see this message every second');
      return marketFunction();
    }, null, true, 'UTC');

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
    createCronJob,
  };
};

module.exports = marketService;
