const { CronJob } = require('../node_modules/cron');
const cron = require('node-cron');
const requester = require('../services/requester-service');
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

  const dummyNodeCron = time =>
    cron.schedule(time, () => {
      console.log(`DUMMY NODE-CRON ON EVERY 10 MINS FROM 03: ${new Date()}`);
    });

  const dummyCron = time =>
    new CronJob(time, () => {
      console.log(`DUMMY CRON ON EVERY 10 MINS FROM 04: ${new Date()}`);
    }, null, true);

  const dummy = () => new Promise((resolve, reject) => {
    requester.get('https://reqres.in/api/users?page=2')
      .then((response) => {
        console.log(`RESPONSE FROM DUMMY CRON: ${response}`);
        const parsedResult = JSON.parse(response);
        resolve(parsedResult);
      })
      .catch(err => reject(err)); // eslint-disable-line
  });

  const dummyRequestNodeCron = (marketFunction, time) =>
    cron.schedule(time, () => {
      console.log(`DUMMY REQUEST NODE-CRON ON EVERY 10 MINS FROM 05: ${new Date()}`);
      return marketFunction();
    });

  const dummyRequestCron = (marketFunction, time) =>
    new CronJob(time, () => {
      console.log(`DUMMY REQUEST CRON ON EVERY 10 MINS FROM 06: ${new Date()}`);
      return marketFunction();
    }, null, true);

  return {
    syncTickersFromCoinMarketCap,
    createCronJob,
    createNodeCron,
    dummyCron,
    dummyNodeCron,
    dummy,
    dummyRequestNodeCron,
    dummyRequestCron,
  };
};

module.exports = marketService;
