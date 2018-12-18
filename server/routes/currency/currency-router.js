const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./currency-controller')(repository, jobs);

  router
    .get('/all', controller.getAllCurrencies)
    .get('/:id', controller.getCurrency);

  app.use('/currency', router);
};

module.exports = { attachTo };
