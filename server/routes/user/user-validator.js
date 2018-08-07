const AManagement = require('../../integrations/Auth0ManagementAPI');

const Auth0ManagementApi = new AManagement();

const userValidator = () => {
  const verifiedPatchUserMetadataValidateRequest = (req, res, next) => {
    const payload = req.body.user_metadata.api;

    if (!req.body || !req.body.user_metadata || !payload) {
      return res.status(400).send({ isSuccessful: false, message: 'No user metadata found' });
    }

    if (!payload.exchange
      || payload.exchange === ''
      || typeof payload.exchange !== 'string') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid exchange' });
    }

    if (!payload.apiKey
      || payload.apiKey === ''
      || typeof payload.apiKey !== 'string') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid apiKey' });
    }

    if (!payload.apiSecret
      || payload.apiSecret === ''
      || typeof payload.apiSecret !== 'string') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid apiSecret' });
    }

    if (!payload.portfolioId
      || payload.portfolioId === ''
      || typeof payload.portfolioId !== 'number') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid portfolioId' });
    }

    return next();
  };

  const verifiedPatchUserMetadataValidateInternals = async (req, res, next) => {
    const { apiKey, apiSecret, portfolioId } = req.body.user_metadata.api;

    // Get user from auth0
    const currentUser = await Auth0ManagementApi.getUser(req, res);
    const filteredUserApis = Object.keys(currentUser.user_metadata).filter((apiName) => {
      if (apiName !== 'api') {
        return ((currentUser.user_metadata[apiName].apiKey === apiKey && currentUser.user_metadata[apiName].portfolioId === portfolioId)
          || (currentUser.user_metadata[apiName].apiSecret === apiSecret && currentUser.user_metadata[apiName].portfolioId === portfolioId));
      }
    });

    // Check user api key and secret already exists
    if (filteredUserApis.length > 0) {
      return res.status(400).send({ isSuccessful: false, message: 'Connection failed - API key and secret are already in use!' });
    }

    return next();
  };

  const patchUserMetadataValidateRequest = (req, res, next) => {
    const payload = req.body.user_metadata.api;

    if (!req.body || !req.body.user_metadata || !payload) {
      return res.status(400).send({ isSuccessful: false, message: 'No user metadata found' });
    }

    if (!payload.id
      || payload.id === ''
      || typeof payload.id !== 'string') {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid api id' });
    }

    return next();
  };

  return {
    verifiedPatchUserMetadataValidateRequest,
    verifiedPatchUserMetadataValidateInternals,
    patchUserMetadataValidateRequest,
  };
};

module.exports = userValidator;
