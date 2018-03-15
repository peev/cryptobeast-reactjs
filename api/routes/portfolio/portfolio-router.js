const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const portfolioController = require('./portfolio-controller')(data);

  router
    .get('/all', (req, res) => {
      return portfolioController.getAllPortfolios(req, res);
    })
    .post('/create', (req, res) => {
      return portfolioController.createPortfolio(req, res);
    })
    .put('/update', (req, res) => {
      return portfolioController.updatePortfolio(req, res);
    })
    .delete('/delete', (req, res) => {
      return portfolioController.removePortfolio(req, res);
    })
    .post('/addAccount', (req, res) => {
      return portfolioController.addAccountToPortfolio(req, res);
    })

  app.use('/portfolio', router);
};

module.exports = { attachTo };
