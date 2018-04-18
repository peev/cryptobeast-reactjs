const { Router } = require('express');

const attachTo = (app, repository) => {
  const router = new Router();
  const portfolioController = require('./portfolio-controller')(repository);

  router
    .post('/create', (req, res) => {
      return portfolioController.createPortfolio(req, res);
    })
    .get('/all', (req, res) => {
      return portfolioController.getAllPortfolios(req, res);
    })
    .get('/:id', (req, res) => {
      return portfolioController.getById(req, res);
    })
    .put('/update', (req, res) => {
      return portfolioController.updatePortfolio(req, res);
    })
    .delete('/delete/:id', (req, res) => {
      return portfolioController.removePortfolio(req, res);
    })
    .post('/updateAssetCost', (req, res) => {
      return portfolioController.updateAssetBTCEquivalent(req, res);
    })
    .post('/updatePortfolioCost', (req, res) => {
      return portfolioController.updatePortfolioBTCEquivalent(req, res);
    })
    .post('/getPortfolioSharePrice', (req, res) => {
      return portfolioController.getPortfolioSharePrice(req, res);
    })
    .post('/getUpdatedPortfolioSharePrice', (req, res) => {
      return portfolioController.getUpdatedPortfolioSharePrice(req, res);
    });

  app.use('/portfolio', router);
};

module.exports = { attachTo };
