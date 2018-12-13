const requester = require('../services/requester-service');

const baseURL = 'pro-api.coinmarketcap.com';


const coinMarketCapServices = () => {
  const getTickers = convertCurrency => new Promise((resolve) => {
    const options = {
      hostname: baseURL,
      path: `/v1/cryptocurrency/listings/latest?limit=100&convert=${convertCurrency}`,
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': 'd6c63851-9eb8-4554-ae3c-90fd28a55019',
        'Content-Type': 'application/json',
      },
    };
    requester.get(options)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        const dataObject = parsedResult.data;

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
      .catch(err => console.log(err));
  });

  return {
    getTickers,
  };
};

module.exports = { coinMarketCapServices };
