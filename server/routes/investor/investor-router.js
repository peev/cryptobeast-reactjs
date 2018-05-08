const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const investorController = require('./investor-controller')(data);

  router
    .post('/add', (req, res) => investorController.createInvestor(req, res))
    .put('/deposit/', (req, res) => investorController.depositInvestor(req, res))
    .put('/withdrawal/', (req, res) => investorController.withdrawalInvestor(req, res))
    .put('/update/:id', (req, res) => investorController.updateInvestor(req, res))
    .delete('/delete', (req, res) => investorController.removeInvestor(req, res));

  app.use('/investor', router);
};

module.exports = { attachTo };
