const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const portfolioController = require('./portfolio-controller')(repository, jobs);

  router
    .post('/create', (req, res) => portfolioController.createPortfolio(req, res))
    .get('/all', (req, res) => portfolioController.getAllPortfolios(req, res))
    .get('/:id', (req, res) => portfolioController.getById(req, res))
    .put('/update', (req, res) => portfolioController.updatePortfolio(req, res))
    .delete('/delete/:id', (req, res) => portfolioController.removePortfolio(req, res))
    .post('/updatePortfolioCost', (req, res) => portfolioController.updatePortfolioBTCEquivalentOnRequest(req, res))
    .post('/getPortfolioSharePrice', (req, res) => portfolioController.getPortfolioSharePrice(req, res))
    .post('/sharePriceHistory', (req, res) => portfolioController.getSharePriceHistory(req, res))

  app.use('/portfolio', router);
};

module.exports = { attachTo };
