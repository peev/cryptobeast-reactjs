const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./currency-controller')(repository, jobs);

  router
    .get('/all', controller.getAllCurrencies);

  app.use('/currency', router);
};

module.exports = { attachTo };
