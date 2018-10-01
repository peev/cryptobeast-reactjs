const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./portfolio-controller')(repository, jobs);
  const validator = require('./portfolio-validator')();
  const authenticationService = require('./../../services/authentication-service')();

  router
    .post('/create', validator.createPortfolio, controller.createPortfolio)
    .get('/all', authenticationService.checkAuthManagementToken, controller.getAllPortfolios)
    .get('/:portfolioId/:item', authenticationService.checkAuthManagementToken, controller.searchItemsInCurrentPortfolio)
    .put('/update/:id', validator.createPortfolio, controller.updatePortfolio)
    .delete('/delete/:id', (req, res) => controller.removePortfolio(req, res))
    .post('/updatePortfolioCost', (req, res) => controller.updatePortfolioBTCEquivalentOnRequest(req, res))
    .post('/getPortfolioSharePrice', (req, res) => controller.getPortfolioSharePrice(req, res))
    .post('/sharePriceHistory', (req, res) => controller.getSharePriceHistory(req, res))
    .post('/priceHistory', (req, res) => controller.getPricesHistory(req, res))
    .post('/periodPriceHistory', (req, res) => controller.getPricesHistoryForPeriod(req, res))
    .post('/getValueHistory', (req, res) => controller.getValueHistory(req, res));

  app.use('/portfolio', router);
};

module.exports = { attachTo };
