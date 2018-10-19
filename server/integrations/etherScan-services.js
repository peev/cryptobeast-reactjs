const requester = require('../services/requester-service');

const baseURL = 'https://api.etherscan.io/api';
const ropsten = 'https://ropsten.etherscan.io/api';

const etherScanServices = () => {
  const getETHUSDPrice = () => new Promise((resolve) => {
    requester.get(`${baseURL}?module=stats&action=ethprice`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult.result.ethusd);
      })
      .catch(err => console.log(err)); // eslint-disable-line
  });

  const getTransactionByHash = txHash => new Promise((resolve, reject) => {
    requester.get(`${baseURL}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult.result);
      })
      .catch(err => reject(err)); // eslint-disable-line
  });

  const getBlockByNumber = blockNumber => new Promise((resolve, reject) => {
    requester.get(`${baseURL}?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber}&boolean=true`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult.result);
      })
      .catch(err => reject(err)); // eslint-disable-line
  });

  return {
    getETHUSDPrice,
    getTransactionByHash,
    getBlockByNumber,
  };
};

module.exports = { etherScanServices };
