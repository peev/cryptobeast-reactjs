const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const accountController = require('./account-controller')(data);

  router
    .post('/add', (req, res) => {
      return accountController.addAccountToPortfolio(req, res);
    })
    .put('/update', (req, res) => {
      return accountController.updateAccount(req, res);
    })
    .delete('/delete', (req, res) => {
      return accountController.removeAccountFromPortfolio(req, res);
    })
    .post('/getBalance', (req, res) => {
      return accountController.getAccountBalance(req, res);
    });

  app.use('/account', router);
};

module.exports = { attachTo };
