const fetch = require('node-fetch');
const baseURL = 'http://apilayer.net/api/live?access_key=5869a28fc5047be19abb8542e52e7638';

const currencyLayerApiService = () => {
  const getTickers = async () => {
    return fetch(baseURL, {
      method: 'GET',
    }).then((result) => result.json());
  };

  return {
    getTickers,
  };
};

module.exports = { currencyLayerApiService };
