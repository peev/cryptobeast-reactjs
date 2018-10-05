const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./wei-transaction-controller')(repository, jobs);
  const validator = require('./wei-transaction-validator')();

  router
    .post('/create', validator.verifyCreateWeiTransaction, controller.createWeiTransaction)
    .get('/:id', controller.getWeiTransaction)
    .delete('/delete/:id', controller.removeWeiTransaction);

  app.use('/wei-transaction', router);
};

module.exports = { attachTo };
