const requester = require('../services/requester-service');
const baseURL = 'http://apilayer.net/api/live?access_key=5869a28fc5047be19abb8542e52e7638';

const currencyLayerApiService = () => {
  const getTickers = convertCurrency => new Promise((resolve) => {
    requester.get(baseURL)
      .then(response => JSON.parse(response))
      .catch(err => console.log(err)); // eslint-disable-line
  });

  return {
    getTickers,
  };
};

module.exports = { currencyLayerApiService };
