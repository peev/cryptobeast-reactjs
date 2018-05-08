const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const assetController = require('./asset-controller')(data);

  router
    .post('/add', (req, res) => assetController.createAsset(req, res))
    .put('/update', (req, res) => assetController.updateAsset(req, res))
    .post('/allocate', (req, res) => assetController.allocateAsset(req, res))
    .delete('/delete', (req, res) => assetController.removeAsset(req, res));

  app.use('/asset', router);
};

module.exports = { attachTo };
