const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./portfolio-controller')(repository, jobs);
  const validator = require('./portfolio-validator')();
  const authenticationService = require('./../../services/authentication-service')();

  router
    .post('/getPortfoliosByAddresses', controller.getPortfoliosByAddresses)
    .get('/getPortfolioAssetsByPortfolioId/:id', controller.getPortfolioAssetsByPortfolioId)
    .get('/:address', controller.getPortfolio)
    .get('/history/:id', controller.getPortfolioValueHistory)
    .get('/historyByPeriod/:id/:period', controller.getPortfolioValueByIdAndPeriod)
    .get('/shareHistory/:portfolioId', controller.getShareHistory)
    .post('/all/stats', controller.getStats)
    .put('/setName/:id', validator.verifyUpdatePortfolioName, controller.setName);
    .post('/create', validator.createPortfolio, controller.createPortfolio)
    .get('/all', authenticationService.checkAuthManagementToken, controller.getAllPortfolios)
    .get('/:portfolioId/:item', authenticationService.checkAuthManagementToken, controller.searchItemsInCurrentPortfolio)
    .put('/update/:id', validator.createPortfolio, controller.updatePortfolio)
    .delete('/delete/:id', (req, res) => controller.removePortfolio(req, res))
    .post('/updatePortfolioCost', (req, res) => controller.updatePortfolioBTCEquivalentOnRequest(req, res))
    .post('/getPortfolioSharePrice', (req, res) => controller.getPortfolioSharePrice(req, res))
    .post('/sharePriceHistory', (req, res) => controller.getSharePriceHistory(req, res))
    .post('/priceHistory', (req, res) => controller.getPricesHistory(req, res))
    .post('/periodPriceHistory', (req, res) => controller.getPricesHistoryForPeriod(req, res));

  app.use('/portfolio', router);
};

module.exports = { attachTo };
