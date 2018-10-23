const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./allocations-controller')(repository, jobs);

  router
    .get('/fetchInfo/:id', controller.getAllocations)
    
    .get('/sync', controller.sync);

  app.use('/allocations', router);
};

module.exports = { attachTo };
