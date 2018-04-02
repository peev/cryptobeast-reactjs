const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const portfolioController = require('./portfolio-controller')(data);

  router
    .post('/create', (req, res) => {
      return portfolioController.createPortfolio(req, res);
    })
    .get('/all', (req, res) => {
      return portfolioController.getAllPortfolios(req, res);
    })
    .put('/update', (req, res) => {
      return portfolioController.updatePortfolio(req, res);
    })
    .delete('/delete', (req, res) => {
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
