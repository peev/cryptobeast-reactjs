const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./wei-fiat-fx-controller')(repository, jobs);
  const validator = require('./wei-fiat-fx-validator')();

  router
    .post('/create', validator.verifyCreateWeiFiatFx, controller.createWeiFiatFx)
    .get('/:id', controller.getWeiFiatFx)
    .put('/update/:id', controller.updateWeiFiatFx)
    .delete('/delete/:id', controller.removeWeiFiatFx);

  app.use('/wei-fiat-fx', router);
};

module.exports = { attachTo };
