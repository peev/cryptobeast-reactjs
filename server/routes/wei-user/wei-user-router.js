const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./wei-user-controller')(repository, jobs);
  const validator = require('./wei-user-validator')();

  router
    .post('/create', validator.verifyCreateWeiUser, controller.createWeiUser)
    .get('/:id', controller.getWeiUser)
    .put('/update/:id', validator.verifyUpdateWeiUser, controller.updateWeiUser);

  app.use('/wei-user', router);
};

module.exports = { attachTo };
