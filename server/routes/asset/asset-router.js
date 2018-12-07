const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const controller = require('./asset-controller')(data);

  router
    .get('/:id', controller.getAsset)
    .get('/history/:tokenId/:period', controller.getAssetPriceHistory)
    .get('/assets-history/:id', controller.getAssetsValueHistory);

  app.use('/asset', router);
};

module.exports = { attachTo };
