const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const tickerController = require('./ticker-controller')(data);

  router
    .get('/syncAll', (req, res) => {
      return tickerController.syncTickersFromWebApi(req, res);
    });

  app.use('/ticker', router);
};

module.exports = { attachTo };
