const { Router } = require('express');


const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const userController = require('./user-controller')(repository, jobs);
  const authenticationService = require('./../../services/authentication-service')();

  router
    .post('/updateClosingTime', (req, res) => userController.updateClosingTime(req, res))
    .patch('/verifiedPatch/:id', authenticationService.checkAuthManagementToken, userController.verifiedPatchUserMetadata)
    .patch('/patch/:id', authenticationService.checkAuthManagementToken, userController.patchUserMetadata)
    .put('/syncApiData/:portfolioId',authenticationService.checkAuthManagementToken, userController.syncUserApiData)
    .patch('/delete/:id', authenticationService.checkAuthManagementToken, userController.deleteUserMetadata);

  app.use('/user', router);
};

module.exports = { attachTo };
