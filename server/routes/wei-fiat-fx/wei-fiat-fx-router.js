const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./wei-fiat-fx-controller')(repository, jobs);
  const validator = require('./wei-fiat-fx-validator')();

  router
    .get('/fetchInfo/:id', controller.getWeiFiatFx)
    
    .get('/sync', controller.sync);

  app.use('/wei-fiat-fx', router);
};

module.exports = { attachTo };
