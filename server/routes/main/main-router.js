const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./main-controller')(repository, jobs);
  const validator = require('./main-validator')();

  router
    .post('/', validator.verifySync, controller.sync);

  app.use('/', router);
};

module.exports = { attachTo };
