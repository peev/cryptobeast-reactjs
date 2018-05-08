const { Router } = require('express');

const attachTo = (app, repository) => {
  const router = new Router();
  const portfolioController = require('./portfolio-controller')(repository);

  router
    .post('/create', (req, res) => portfolioController.createPortfolio(req, res))
    .get('/all', (req, res) => portfolioController.getAllPortfolios(req, res))
    .get('/:id', (req, res) => portfolioController.getById(req, res))
    .put('/update', (req, res) => portfolioController.updatePortfolio(req, res))
    .delete('/delete/:id', (req, res) => portfolioController.removePortfolio(req, res))
    .post('/updateAssetCost', (req, res) => portfolioController.updateAssetBTCEquivalent(req, res))
    .post('/updatePortfolioCost', (req, res) => portfolioController.updatePortfolioBTCEquivalent(req, res))
    .post('/getPortfolioSharePrice', (req, res) => portfolioController.getPortfolioSharePrice(req, res))

  app.use('/portfolio', router);
};

module.exports = { attachTo };
