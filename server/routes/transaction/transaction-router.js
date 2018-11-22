const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./transaction-controller')(repository, jobs);
  const validator = require('./transaction-validator')();

  router
    .get('/:id', controller.getTransaction);

  app.use('/transaction', router);
};

module.exports = { attachTo };
