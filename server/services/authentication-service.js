const AManagement = require('./Auth0ManagementAPI');


const authenticationService = () => {
  // Apply Auth0 middleware to check and update token if necessary;
  const Auth0ManagementApi = new AManagement();

  const checkAuthManagementToken = async (req, res, next) => {
    try {
      const access_token = await Auth0ManagementApi.getToken();
      req.token = access_token;
      next();
    } catch (error) {
      res.json(error);
    }
  };

  return {
    checkAuthManagementToken,
  };
};

module.exports = authenticationService;
