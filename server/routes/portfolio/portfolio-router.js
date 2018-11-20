const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./portfolio-controller')(repository, jobs);
  const validator = require('./portfolio-validator')();

  router
    .post('/getPortfoliosByAddresses', controller.getPortfoliosByAddresses)
    .get('/getPortfolioAssetsByPortfolioId/:id', controller.getPortfolioAssetsByPortfolioId)
    .post('/create', validator.verifyCreatePortfolio, controller.createPortfolio)
    .get('/:address', controller.getPortfolio)
    .put('/update/:id', validator.verifyUpdatePortfolio, controller.updatePortfolio)
    .put('/updatePortfolioTotalInvastments/:address', controller.updatePortfolioTotalInvestment)
    .delete('/delete/:id', controller.removePortfolio)
    .get('/history/:id', controller.getPortfolioValueHistory);

  app.use('/portfolio', router);
};

module.exports = { attachTo };
