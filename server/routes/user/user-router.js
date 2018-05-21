const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const userController = require('./user-controller')(repository, jobs);

  router
    .post('/updateClosingTime', (req, res) => userController.updateClosingTime(req, res))

  app.use('/user', router);
};

module.exports = { attachTo };
