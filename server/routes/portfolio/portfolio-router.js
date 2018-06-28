const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const portfolioController = require('./portfolio-controller')(repository, jobs);
  const authenticationService = require('./../../services/authentication-service')();

  router
    .post('/create', (req, res) => portfolioController.createPortfolio(req, res))
    .get('/all', authenticationService.checkAuthManagementToken, portfolioController.getAllPortfolios)
    .get('/:portfolioId/:item', authenticationService.checkAuthManagementToken, portfolioController.searchItemsInCurrentPortfolio)
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
