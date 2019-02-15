const requester = require('../services/requester-service');
const constants = require('../utils/constants');

const coinMarketCapServices = () => {
  const getTickers = convertCurrency => new Promise((resolve, reject) => {
    console.log(`GET START ${new Date()}`);
    const options = {
      hostname: constants.urls.coinMarketCapApi,
      path: `/v1/cryptocurrency/listings/latest?limit=100&convert=${convertCurrency}`,
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': `${constants.apiKeys.coinMarketCapApiKey}`,
        'Content-Type': 'application/json',
      },
    };
    requester.get(options)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        const dataObject = parsedResult.data;
        console.log(`GET SUCCESS ${dataObject.length}`);
        return resolve(Object.keys(dataObject).map(el => ({
          currency: dataObject[el].symbol,
          currencyLong: dataObject[el].name,
          convertCurrency,
          rank: dataObject[el].rank,
          price: dataObject[el].quote[convertCurrency].price,
          volumeFor24h: dataObject[el].quote[convertCurrency].volume_24h,
          percentChangeFor1h: dataObject[el].quote[convertCurrency].percent_change_1h,
          percentChangeFor24h: dataObject[el].quote[convertCurrency].percent_change_24h,
          percentChangeFor7d: dataObject[el].quote[convertCurrency].percent_change_7d,
        })));
      })
      .catch((err) => {
        console.log(`GET ERROR ${err}`);
        return reject(err);
      });
  });

  return {
    getTickers,
  };
};

module.exports = { coinMarketCapServices };
