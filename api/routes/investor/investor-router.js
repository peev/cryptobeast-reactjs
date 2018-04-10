const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const investorController = require('./investor-controller')(data);

  router
    .post('/add', (req, res) => {
      return investorController.addInvestorToPortfolio(req, res);
    })
    .put('/deposit/', (req, res) => {
      return investorController.depositInvestor(req, res);
    })
    .put('/withdrawal/', (req, res) => {
      return investorController.withdrawalInvestor(req, res);
    })
    .put('/update/:id', (req, res) => {
      return investorController.updateInvestor(req, res);
    })
    .delete('/delete', (req, res) => {
      return investorController.removeInvestorFromPortfolio(req, res);
    });

  app.use('/investor', router);
};

module.exports = { attachTo };
