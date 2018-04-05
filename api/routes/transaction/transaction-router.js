const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const transactionController = require('./transaction-controller')(data);

  router
    .post('/add', (req, res) => {
      return transactionController.addTransactionToPortfolio(req, res);
    });

  app.use('/transaction', router);
};

module.exports = { attachTo };
