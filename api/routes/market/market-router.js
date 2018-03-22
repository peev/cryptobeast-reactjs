const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const marketController = require('./market-controller')(data);

  router
    .get('/summaries', (req, res) => {
      return marketController.getSummaries(req, res);
    })
    .get('/baseCurrencies', (req, res) => {
      return marketController.getBaseCurrencies(req, res);
    });

  app.use('/market', router);
};

module.exports = { attachTo };
