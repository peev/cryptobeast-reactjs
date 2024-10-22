const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const marketController = require('./market-controller')(data);

  router
    .get('/syncSummaries', (req, res) => {
      return marketController.syncSummaries(req, res);
    })
    .get('/summaries', (req, res) => {
      return marketController.getSummaries(req, res);
    })
    .get('/baseCurrencies', (req, res) => {
      return marketController.getBaseCurrencies(req, res);
    })
    .get('/syncTickers', (req, res) => {
      return marketController.syncTickersFromApi(req, res);
    })
    .post('/syncBaseTickers', (req, res) => {
      return marketController.syncTickersFromKraken(req, res); // Kraken
    })
    .get('/allTickers', (req, res) => {
      return marketController.getAllTickers(req, res);
    })
    .get('/syncCurrencies', (req, res) => {
      return marketController.syncCurrenciesFromApi(req, res);
    })
    .get('/allCurrencies', (req, res) => {
      return marketController.getAllCurrencies(req, res);
    })

  app.use('/market', router);
};

module.exports = { attachTo };
