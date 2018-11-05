const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./currency-controller')(repository, jobs);
  const validator = require('./currency-validator')();

  router
    .post('/create', validator.verifyCreateCurrency, controller.createCurrency)
    .get('/all', controller.getAllCurrencies)
    .get('/:id', controller.getCurrency)
    .put('/update/:id', controller.updateCurrency)
    .delete('/delete/:id', controller.removeCurrency);

  app.use('/currency', router);
};

module.exports = { attachTo };
