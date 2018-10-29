const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const weidexController = require('./weidex-controller')(data);

  router
    .post('/sync', (req, res) => weidexController.sync(req, res))
    .get('/sync/:id', (req, res) => weidexController.sync(req, res))
    .get('/user/:address', (req, res) => weidexController.getUser(req, res))
    .get('/token/all', (req, res) => weidexController.getAllTokens(req, res))
    .get('/balance/user/:userAddress', (req, res) => weidexController.getBalanceByUser(req, res))
    .get('/deposit/user/:id', (req, res) => weidexController.getUserDeposit(req, res))
    .get('/withdraw/user/:id', (req, res) => weidexController.getUserWithdraw(req, res))
    .get('/order/user/:userId/token/:tokenId', (req, res) => weidexController.getUserOpenOrders(req, res))
    .get('/order/open/token/:tokenId/type/:type', (req, res) => weidexController.getUserOpenOrdersByOrderType(req, res))
    .get('/orderHistory/token/:tokenId', (req, res) => weidexController.getUserOrderHistoryByToken(req, res))
    .get('/orderHistory/user/:userId', (req, res) => weidexController.getUserOrderHistoryByUser(req, res))
    .get('/orderHistory/user/:userId/token/:tokenId', (req, res) => weidexController.getUserOrderHistoryByUserAndToken(req, res));

  app.use('/weidex', router);
};

module.exports = { attachTo };
