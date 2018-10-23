const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const controller = require('./asset-controller')(data);
  const validator = require('./asset-validator')();

  router
    .post('/create', validator.verifyCreateAsset, controller.createAsset)
    .get('/:id', controller.getAsset)
    .put('/update/:id', validator.verifyUpdateAsset, controller.updateAsset)
    .put('/updateAssetWeight/:id', controller.updateAssetWeight)
    .delete('/delete/:id', controller.removeAsset);

  app.use('/asset', router);
};

module.exports = { attachTo };
