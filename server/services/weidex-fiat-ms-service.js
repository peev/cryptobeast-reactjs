const requester = require('./requester-service');

const weidexFiatMsUrl = 'https://weibeast.motiontest.eu/microapi';

const WeidexFiatMsService = () => {
  const getFiatValueByTimestamp = timestamp => new Promise((resolve, reject) => {
    requester.get(`${weidexFiatMsUrl}/fiat/currenciesByTimestamp?timestamp=${timestamp}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult);
      })
      .catch(err => reject(err));
  });

  const getEtherValueByTimestamp = timestamp => new Promise((resolve, reject) => {
    requester.get(`${weidexFiatMsUrl}/ether/etherPriceByTimestamp?timestamp=${timestamp}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult);
      })
      .catch(err => reject(err));
  });

  const getEtherValueByRange = (start, end) => new Promise((resolve, reject) => {
    requester.get(`${weidexFiatMsUrl}/ether/etherPriceByRange?start=${start}&end=${end}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult);
      })
      .catch(err => reject(err));
  });

  const getEtherPriceByRangeDayValue = (start, end) => new Promise((resolve, reject) => {
    requester.get(`${weidexFiatMsUrl}/ether/etherPriceByRangeDayValue?start=${start}&end=${end}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult);
      })
      .catch(err => reject(err));
  });

  return {
    getFiatValueByTimestamp,
    getEtherValueByTimestamp,
    getEtherValueByRange,
    getEtherPriceByRangeDayValue,
  };
};

module.exports = WeidexFiatMsService;
