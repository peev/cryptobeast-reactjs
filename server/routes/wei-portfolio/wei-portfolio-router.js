const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./wei-portfolio-controller')(repository, jobs);
  const validator = require('./wei-portfolio-validator')();

  router
    .post('/create', validator.verifyCreateWeiPortfolio, controller.createWeiPortfolio)
    .get('/:address', controller.getWeiPortfolio)
    .put('/update/:id', validator.verifyUpdateWeiPortfolio, controller.updateWeiPortfolio)
    .delete('/delete/:id', controller.removeWeiPortfolio);

  app.use('/wei-portfolio', router);
};

module.exports = { attachTo };