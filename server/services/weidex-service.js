// const fetch = require('node-fetch');
// const request = require('requestretry');
const requester = require('../services/requester-service');
const http = require('../services/http');

const url = 'https://core.weidex.market';
const staging = 'http://staging-core-java.herokuapp.com';
const dataFeeder = 'https://production-datafeeder.herokuapp.com';

const WeidexService = (repository) => {
  const getTokenTicker = tokenId => new Promise((resolve, reject) => {
    http.get(`${staging}/token/ticker/${tokenId}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        return resolve(parsedResult);
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
    // request({
    //   url: `${staging}/token/ticker/${tokenId}`,
    //   json: true,
    //   maxAttempts: 3,
    //   retryDelay: 3100,
    //   retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    // }, (err, response, body) => {
    //   if (err) return reject(err);
    //   if (body) {
    //     if (body.error) return reject(body.error); // Probably invalid API call
    //     return resolve(body);
    //   }
    //   return resolve([]); // eslint rule of consistent returns. Function must return value in every case;
    // });
  });

  const getCurrencyStats = (currencyId, from, to) => new Promise((resolve, reject) => {
    requester.get(`${dataFeeder}/get/${currencyId}/${from}/${to}/1d`)
      .then((response) => {
        const parsedResult = JSON.parse(response.replace(/\\n/g, '').replace(/ /g, ''));
        return resolve(parsedResult);
      })
      .catch(err => reject(err)); // eslint-disable-line
  });

  const getUserDepositHttp = id => new Promise((resolve, reject) => {
    http.get(`${staging}/deposit/user/${id}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getUserWithdrawHttp = id => new Promise((resolve, reject) => {
    http.get(`${staging}/withdraw/user/${id}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getUserOrderHistoryByUserHttp = userId => new Promise((resolve, reject) => {
    http.get(`${staging}/orderHistory/user/${userId}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getUserHttp = address => new Promise((resolve, reject) => {
    http.get(`${staging}/user/${address}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getAllTokensHttp = () => new Promise((resolve, reject) => {
    http.get(`${staging}/token/all`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getBalanceByUserHttp = address => new Promise((resolve, reject) => {
    http.get(`${staging}/balance/user/${address}`)
      .then((response) => {
        resolve(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getTokenValueByTimestampHttp = (id, timestamp) => new Promise((resolve, reject) => {
    http.get(`${staging}/token/${id}/price/${timestamp}`)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });

  const getTokensValuesHistoryHttp = (timestamp, days) => new Promise((resolve, reject) => {
    http.get(`${staging}/token/all/price/${timestamp}/days/${days}`)
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
