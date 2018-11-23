const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const controller = require('./investor-controller')(data);
  const validator = require('./investor-validator')();

  router
    .post('/add', validator.createInvestor, controller.createInvestor)
    .put('/update/:id/', validator.updateInvestor, controller.updateInvestor)
    .put('/delete/:id/', validator.deleteInvestor, controller.removeInvestor);

  app.use('/investor', router);
};

module.exports = { attachTo };
