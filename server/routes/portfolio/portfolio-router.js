const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const portfolioController = require('./portfolio-controller')(repository, jobs);

  router
    .post('/create', (req, res) => portfolioController.createPortfolio(req, res))
    .get('/all', (req, res) => portfolioController.getAllPortfolios(req, res))
    .get('/:portfolioId/:item', (req, res) => portfolioController.searchItemsInCurrentPortfolio(req, res))
    .put('/update/:id', (req, res) => portfolioController.updatePortfolio(req, res))
    .delete('/delete/:id', (req, res) => portfolioController.removePortfolio(req, res))
    .post('/updatePortfolioCost', (req, res) => portfolioController.updatePortfolioBTCEquivalentOnRequest(req, res))
    .post('/getPortfolioSharePrice', (req, res) => portfolioController.getPortfolioSharePrice(req, res))
    .post('/sharePriceHistory', (req, res) => portfolioController.getSharePriceHistory(req, res))
    .post('/priceHistory', (req, res) => portfolioController.getPricesHistory(req, res))
    .post('/periodPriceHistory', (req, res) => portfolioController.getPricesHistoryForPeriod(req, res));

  app.use('/portfolio', router);
};

module.exports = { attachTo };
