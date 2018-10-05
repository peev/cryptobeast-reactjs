const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const controller = require('./wei-asset-controller')(data);
  const validator = require('./wei-asset-validator')();

  router
    .post('/create', validator.verifyCreateWeiAssetset, controller.createWeiAsset)
    .put('/update/:id', validator.verifyUpdateWeiAsset, controller.updateWeiAsset)
    .delete('/delete/:id', controller.removeWeiAsset);

  app.use('/wei-asset', router);
};

module.exports = { attachTo };
