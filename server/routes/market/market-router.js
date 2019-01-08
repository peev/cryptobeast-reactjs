const { Router } = require('express');

const attachTo = (app, repository) => {
  const router = new Router();
  const controller = require('./market-controller')(repository);

  router
    .get('/tickersFromCoinMarketCap', controller.getTickersFromCoinMarketCap)
    .get('/getEthToUsd', controller.getEthToUsd)
    .get('/ethHistory/:portfolioId', controller.getEthHistory);

  app.use('/market', router);
};

module.exports = { attachTo };
