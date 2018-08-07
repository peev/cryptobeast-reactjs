const requester = require('../services/requester-service');

const baseURL = 'https://api.coinmarketcap.com/v2';


// TODO: Fix Errors When convertCurrency has invalid value
const coinMarketCapServices = () => {
  const getTickers = convertCurrency => new Promise((resolve) => {
    requester.get(`${baseURL}/ticker/?convert=${convertCurrency}&limit=100`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        const dataObject = parsedResult.data;

        resolve(Object.keys(dataObject).map(el => ({
          currency: dataObject[el].symbol,
          currencyLong: dataObject[el].name,
          convertCurrency,
          rank: dataObject[el].rank,
          price: dataObject[el].quotes[convertCurrency].price,
          volumeFor24h: dataObject[el].quotes[convertCurrency].volume_24h,
          percentChangeFor1h: dataObject[el].quotes[convertCurrency].percent_change_1h,
          percentChangeFor24h: dataObject[el].quotes[convertCurrency].percent_change_24h,
          percentChangeFor7d: dataObject[el].quotes[convertCurrency].percent_change_7d,
        })));
      })
      .catch(err => console.log(err)); // eslint-disable-line
  });

  return {
    getTickers,
  };
};

module.exports = { coinMarketCapServices };
