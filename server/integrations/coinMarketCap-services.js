const requester = require('../services/requester');
const allTickersURL = 'https://api.coinmarketcap.com/v2/ticker/';

const coinMarketCapServices = () => {
  const getTickers = () => {
    return new Promise((resolve, reject) => {
      requester.get(allTickersURL)
        .then((response) => {
          const parsedResult = JSON.parse(response);
          const dataObject = parsedResult.data;

          resolve(Object.keys(dataObject).map((el) => {
            return {
              currency: dataObject[el].symbol,
              currencyLong: dataObject[el].name,
              rank: dataObject[el].rank,
              priceInUSD: dataObject[el].quotes.USD.price,
              volumeFor24h: dataObject[el].quotes.USD.volume_24h,
              percentChangeFor1hInUSD: dataObject[el].quotes.USD.percent_change_1h,
              percentChangeFor24hInUSD: dataObject[el].quotes.USD.percent_change_24h,
              percentChangeFor7dInUSD: dataObject[el].quotes.USD.percent_change_7d,
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
