const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const controller = require('./trade-history-controller')(data);

  router
    .get('/all/:portfolioId', controller.getAllTradesByPortfolioId)
    .get('/:id', controller.getTrade);

  app.use('/trade', router);
};

module.exports = { attachTo };
