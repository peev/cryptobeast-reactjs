const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const controller = require('./wei-trade-history-controller')(data);
  const validator = require('./wei-trade-history-validator')();

  router
    .post('/create', validator.verifyCreateWeiTradeHistory, controller.createWeiTrade)
    .get('/:id', controller.getWeiTrade)
    .put('/update/:id', controller.updateWeiTrade)
    .delete('/delete/:id', controller.removeWeiTrade);

  app.use('/wei-trade', router);
};

module.exports = { attachTo };
