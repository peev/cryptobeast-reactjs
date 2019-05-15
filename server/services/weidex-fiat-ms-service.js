const http = require('./http');
const constants = require('../utils/constants');

const WeidexFiatMsService = () => {
  const getFiatValueByTimestamp = timestamp => new Promise((resolve, reject) => {
    http.get(`${constants.urls.weibeastFiatMs}/fiat/currenciesByTimestamp?timestamp=${timestamp}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult);
      })
      .catch(err => reject(err));
  });

  const getEtherValueByTimestamp = timestamp => new Promise((resolve, reject) => {
    http.get(`${constants.urls.weibeastFiatMs}/ether/etherPriceByTimestamp?timestamp=${timestamp}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult);
      })
      .catch(err => reject(err));
  });

  const getEtherPriceByRangeDayValue = (start, end) => new Promise((resolve, reject) => {
    http.get(`${constants.urls.weibeastFiatMs}/ether/etherPriceByRangeDayValue?start=${start}&end=${end}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult);
      })
      .catch(err => reject(err));
  });

  return {
    getFiatValueByTimestamp,
    getEtherValueByTimestamp,
    getEtherPriceByRangeDayValue,
  };
};

module.exports = WeidexFiatMsService;
