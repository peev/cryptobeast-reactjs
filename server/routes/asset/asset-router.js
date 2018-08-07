const { Router } = require('express');

const attachTo = (app, data) => {
  const router = new Router();
  const controller = require('./asset-controller')(data);
  const validator = require('./asset-validator')();

  router
    .post('/add', validator.addAsset, controller.createAsset)
    .put('/update/:id', controller.updateAsset)
    .post('/allocate', validator.allocate, controller.allocateAsset)
    .delete('/delete/:id', controller.removeAsset);

  app.use('/asset', router);
};

module.exports = { attachTo };
