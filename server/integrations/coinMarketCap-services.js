const requester = require('../services/requester');
const baseURL = 'https://api.coinmarketcap.com/v2'

const coinMarketCapServices = () => {
  const getTickers = (convertCurrency) => {
    return new Promise((resolve, reject) => {
      requester.get(`${baseURL}/ticker/?convert=${convertCurrency}&limit=100`)
        .then((response) => {
          const parsedResult = JSON.parse(response);
          const dataObject = parsedResult.data;

          resolve(Object.keys(dataObject).map((el) => {
            return {
              currency: dataObject[el].symbol,
              currencyLong: dataObject[el].name,
              convertCurrency: convertCurrency,
              rank: dataObject[el].rank,
              price: dataObject[el].quotes[convertCurrency].price,
              volumeFor24h: dataObject[el].quotes[convertCurrency].volume_24h,
              percentChangeFor1h: dataObject[el].quotes[convertCurrency].percent_change_1h,
              percentChangeFor24h: dataObject[el].quotes[convertCurrency].percent_change_24h,
              percentChangeFor7d: dataObject[el].quotes[convertCurrency].percent_change_7d,
            }
          }))
        })
    });
  };

  return {
    getTickers,
  };
};

module.exports = { coinMarketCapServices };
