const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const investorController = require('./investor-controller')(data);

  router
    .get('/all', (req, res) => {
      return investorController.getAllInvestor(req, res);
    })
    .post('/create', (req, res) => {
      return investorController.createInvestor(req, res);
    });

  app.use('/investor', router);
};

module.exports = { attachTo };
