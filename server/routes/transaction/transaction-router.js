const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./transaction-controller')(repository, jobs);

  router
    .get('/:id', controller.getTransaction)
    .get('/all/:portfolioId', controller.getTransactions)
    .put('/setInvestor/:id/:investorId', controller.setInvestor);

  app.use('/transaction', router);
};

module.exports = { attachTo };
