const requester = require('./requester-service');
const constants = require('../utils/constants');

const WeidexFiatMsService = () => {
  const getFiatValueByTimestamp = timestamp => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.weibeastFiatMs}/fiat/currenciesByTimestamp?timestamp=${timestamp}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult);
      })
      .catch(err => reject(err));
  });

  // Test
  const getEtherValueByTimestamp = timestamp => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.weibeastFiatMs}/ether/etherPriceByTimestamp?timestamp=${timestamp}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult);
      })
      .catch(err => reject(err));
  });

  const getEtherPriceByRangeDayValue = (start, end) => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.weibeastFiatMs}/ether/etherPriceByRangeDayValue?start=${start}&end=${end}`)
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
