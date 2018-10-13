const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./wei-currency-controller')(repository, jobs);
  const validator = require('./wei-currency-validator')();

  router
    .post('/create', validator.verifyCreateWeiCurrency, controller.createWeiCurrency)
    .get('/:id', controller.getWeiCurrency)
    .put('/update/:id', controller.updateWeiCurrency)
    .delete('/delete/:id', controller.removeWeiCurrency);

  app.use('/wei-currency', router);
};

module.exports = { attachTo };
