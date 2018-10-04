const { Router } = require('express');

const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const controller = require('./wei-portfolio-controller')(repository, jobs);
  const validator = require('./wei-portfolio-validator')();

  router
    .post('/create', validator.verifyCreateWeiPortfolio, controller.createWeiPortfolio)
    .get('/:id', controller.getWeiPortfolio)
    .put('/update/:id', validator.verifyUpdateWeiPortfolio, controller.updateWeiPortfolio);

  app.use('/wei-portfolio', router);
};

module.exports = { attachTo };
