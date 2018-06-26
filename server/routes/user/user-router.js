const { Router } = require('express');
const AManagement = require('./../../services/Auth0ManagementAPI');

const attachTo = (app, repository, jobs, config) => {
  const router = new Router();
  const userController = require('./user-controller')(repository, jobs);

  // Apply Auth0 middleware to check and update token if necessary;
  const Auth0ManagementApi = new AManagement(config.authManagementApi);
  const checkAuthManagementToken = async (req, res, next) => {
    try {
      const access_token = await Auth0ManagementApi.getToken();
      req.token = access_token;
      next();
    } catch (error) {
      res.json(error);
    }
  };

  router
    .post('/updateClosingTime', (req, res) => userController.updateClosingTime(req, res))
    .patch('/patch/:id', checkAuthManagementToken, Auth0ManagementApi.patchUser);

  app.use('/user', router);
};

module.exports = { attachTo };
