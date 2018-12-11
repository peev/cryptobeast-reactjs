const { Router } = require('express');

const attachTo = (app) => {
  const router = new Router();
  const controller = require('./market-controller')();

  router
    .get('/tickersFromCoinMarketCap', controller.getTickersFromCoinMarketCap);

  app.use('/market', router);
};

module.exports = { attachTo };
