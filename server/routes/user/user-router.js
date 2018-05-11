const { Router } = require('express');

const attachTo = (app, repository) => {
  const router = new Router();
  const userController = require('./user-controller')(repository);

  router
    .post('/updateClosingTime', (req, res) => userController.updateClosingTime(req, res))

  app.use('/user', router);
};

module.exports = { attachTo };
