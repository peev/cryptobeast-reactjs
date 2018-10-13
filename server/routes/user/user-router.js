const { Router } = require('express');


const attachTo = (app, repository, jobs) => {
  const router = new Router();
  const userController = require('./user-controller')(repository, jobs);
  const validator = require('./user-validator')();

  router
    .post(
      '/updateClosingTime',
      (req, res) => userController.updateClosingTime(req, res),
    )
    .patch(
      '/verifiedPatch/:id',
      validator.verifiedPatchUserMetadataValidateInternals,
      userController.verifiedPatchUserMetadata,
    )
    .patch(
      '/patch/:id',
      validator.patchUserMetadataValidateRequest,
      userController.patchUserMetadata,
    )
    .patch(
      '/delete/:id',
      userController.deleteUserMetadata,
    )
    .put(
      '/syncApiData/:portfolioId',
      validator.syncUserApiDataRequest,
      userController.syncUserApiData,
    );

  app.use('/user', router);
};

module.exports = { attachTo };
