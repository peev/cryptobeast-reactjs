const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const assetController = require('./asset-controller')(data);

  router
    .post('/add', (req, res) => {
      return assetController.addAssetToPortfolio(req, res);
    })
    .put('/update', (req, res) => {
      return assetController.updateAsset(req, res);
    })
    .delete('/delete', (req, res) => {
      return assetController.removeAssetFromPortfolio(req, res);
    });

  app.use('/asset', router);
};

module.exports = { attachTo };
