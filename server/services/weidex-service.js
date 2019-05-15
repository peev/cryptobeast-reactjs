const requester = require('../services/requester-service');
const constants = require('../utils/constants');

const WeidexService = () => {
  const getTokenTicker = tokenId => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.weidex}/token/ticker/${tokenId}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        return resolve(parsedResult);
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getCurrencyStats = (currencyId, from, to) => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.weidexDataFeeder}/get/${currencyId}/${from}/${to}/1d`)
      .then((response) => {
        const parsedResult = JSON.parse(response.replace(/\\n/g, '').replace(/ /g, ''));
        return resolve(parsedResult);
      })
      .catch(err => reject(err));
  });

  const getUserDepositHttp = id => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.weidex}/deposit/user/${id}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getUserWithdrawHttp = id => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.weidex}/withdraw/user/${id}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getUserOrderHistoryByUserHttp = userId => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.weidex}/orderHistory/user/${userId}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getUserHttp = address => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.weidex}/user/${address}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getAllTokensHttp = () => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.weidex}/token/all`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getBalanceByUserHttp = address => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.weidex}/balance/user/${address}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getTokenValueByTimestampHttp = (id, timestamp) => new Promise((resolve, reject) => {
    http.get(`${constants.urls.weidex}/token/${id}/price/${timestamp}`)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getTokensValuesHistoryHttp = (timestamp, days) => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.weidex}/token/all/price/${timestamp}/days/${days}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  return {
    getUserHttp,
    getBalanceByUserHttp,
    getUserDepositHttp,
    getUserWithdrawHttp,
    getUserOrderHistoryByUserHttp,
    getTokenTicker,
    getCurrencyStats,
    getAllTokensHttp,
    getTokenValueByTimestampHttp,
    getTokensValuesHistoryHttp,
  };
};

module.exports = WeidexService;
