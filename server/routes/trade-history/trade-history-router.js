const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const controller = require('./trade-history-controller')(data);
  const validator = require('./trade-history-validator')();

  router
    .post('/create', validator.verifyCreateTradeHistory, controller.createTrade)
    .get('/:id', controller.getTrade)
    .delete('/delete/:id', controller.removeTrade);

  app.use('/trade', router);
};

module.exports = { attachTo };
