const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./portfolio-controller')(repository, jobs);

  router
    .post('/getPortfoliosByAddresses', controller.getPortfoliosByAddresses)
    .get('/getPortfolioAssetsByPortfolioId/:id', controller.getPortfolioAssetsByPortfolioId)
    .get('/:address', controller.getPortfolio)
    .get('/history/:id', controller.getPortfolioValueHistory)
    .get('/historyByPeriod/:id/:period', controller.getPortfolioValueByIdAndPeriod)
    .get('/alpha/:id/:period/:benchmark', controller.getAlpha);

  app.use('/portfolio', router);
};

module.exports = { attachTo };
