const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const weidexController = require('./weidex-controller')(data);
  const validator = require('./weidex-validator')();

  router
    .post('/sync', validator.verifySync, weidexController.sync)
    .post('/validateAddresses', weidexController.validateAddresses);

  app.use('/weidex', router);
};

module.exports = { attachTo };
