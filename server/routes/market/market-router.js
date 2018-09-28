const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const marketController = require('./market-controller')(data);

  router
    .get('/syncSummaries', (req, res) => {
      return marketController.syncSummariesOnRequest(req, res);
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
      return marketController.syncTickersFromKrakenOnRequest(req, res); // Kraken
    })
    .post('/syncMarketPriceHistory', (req, res) => {
      return marketController.syncTickersFromCoinMarketCapOnRequest(req, res); // Coin Market Cap
    })
    .get('/getMarketPriceHistory', (req, res) => {
      return marketController.getAllMarketPriceHistory(req, res); // Coin Market Cap
    })
    .get('/allTickers', (req, res) => {
      return marketController.getAllTickers(req, res);
    })
    .get('/syncCurrencies', (req, res) => {
      return marketController.syncCurrenciesFromApiOnRequest(req, res);
    })
    .get('/allCurrencies', (req, res) => {
      return marketController.getAllCurrencies(req, res);
    })
    .post('/periodPriceHistory', (req, res) => {
      return marketController.getBaseTickersHistory(req, res);
    })
    .get('/profitAndLossHistory', (req, res) => {
      return marketController.getProfitAndLossHistory(req, res);
    })
    .get('/liquidityHistory', (req, res) => {
      return marketController.getLiquidityHistory(req, res);
    })
    .get('/correlationMatrixHistory', (req, res) => {
      return marketController.getCorrelationMatrixHistory(req, res);
    });

  app.use('/market', router);
};

module.exports = { attachTo };
