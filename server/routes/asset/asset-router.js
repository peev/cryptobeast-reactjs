const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const controller = require('./asset-controller')(data);

  router
    .get('/:id', controller.getAsset)
    .get('/history/:tokenId/:period', controller.getAssetPriceHistory);

  app.use('/asset', router);
};

module.exports = { attachTo };
