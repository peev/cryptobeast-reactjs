const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./wei-user-controller')(repository, jobs);
  const validator = require('./wei-user-validator')();

  router
    .post('/create', validator.verifyCreateWeiUser, controller.createWeiUser)
    .get('/:address', controller.getWeiUser)
    .put('/update/:id', controller.updateWeiUser)
    .delete('/delete/:id', (req, res) => controller.deleteWeiUser(req, res));

  app.use('/wei-user', router);
};

module.exports = { attachTo };
