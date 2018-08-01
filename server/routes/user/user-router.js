const { Router } = require('express');


const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const userController = require('./user-controller')(repository, jobs);
  const validator = require('./user-validator')();
  const authenticationService = require('./../../services/authentication-service')();

  router
    .post('/updateClosingTime', (req, res) => userController.updateClosingTime(req, res))
    .patch('/verifiedPatch/:id',
      validator.verifiedPatchUserMetadataValidateRequest,
      authenticationService.checkAuthManagementToken,
      validator.verifiedPatchUserMetadataValidateInternals,
      userController.verifiedPatchUserMetadata)
    .patch('/patch/:id', validator.patchUserMetadataValidateRequest, authenticationService.checkAuthManagementToken, userController.patchUserMetadata)
    .patch('/delete/:id', authenticationService.checkAuthManagementToken, userController.deleteUserMetadata);

  app.use('/user', router);
};

module.exports = { attachTo };
