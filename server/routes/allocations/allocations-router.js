const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./allocations-controller')(repository, jobs);

  router
    .get('/fetchInfo/:portfolioId', controller.getAllocations);

  app.use('/allocations', router);
};

module.exports = { attachTo };
