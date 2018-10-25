const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./fiat-fx-controller')(repository, jobs);

  router
    .get('/fetchInfo/:id', controller.getFiatFx)
    
    .get('/sync', controller.sync);

  app.use('/fiat-fx', router);
};

module.exports = { attachTo };
