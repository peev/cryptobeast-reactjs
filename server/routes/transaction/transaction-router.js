const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./transaction-controller')(repository, jobs);
  const validator = require('./transaction-validator')();

  router
    .post('/create', validator.verifyCreateTransaction, controller.createTransaction)
    .get('/:id', controller.getTransaction)
    .put('/update/:id', validator.verifyUpdateTransaction, controller.updateTransaction)
    .delete('/delete/:id', controller.removeTransaction);

  app.use('/transaction', router);
};

module.exports = { attachTo };
