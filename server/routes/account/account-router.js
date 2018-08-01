const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const accountController = require('./account-controller')(data);

  router
    .post('/add', (req, res) => accountController.createAccount(req, res))
    .put('/update/:id', (req, res) => accountController.updateAccount(req, res))
    .delete('/delete/:id', (req, res) => accountController.removeAccount(req, res))
    .post('/getBalance', (req, res) => accountController.getAccountBalance(req, res))
    .post('/createTrade', (req, res) => accountController.createTrade(req, res))
    .put('/updateTrade/:id', (req, res) => accountController.updateTrade(req, res))
    .delete('/deleteTrade/:id', (req, res) => accountController.removeTrade(req, res))
    .get('/allTrades', (req, res) => accountController.getAllTrades(req, res));

  app.use('/account', router);
};

module.exports = { attachTo };
