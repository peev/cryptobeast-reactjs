const constants = require('../utils/constants');
const requester = require('../services/requester-service');

const etherScanServices = () => {
  const getETHUSDPrice = () => new Promise((resolve) => {
    requester.get(`${constants.urls.etherScan}?module=stats&action=ethprice&apikey=${constants.apiKeys.etherScanApiKey}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult.result.ethusd);
      })
      .catch(err => console.log(err));
  });

  const getTransactionByHash = txHash => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.ropsten}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult.result);
      })
      .catch(err => reject(err));
  });

  const getBlockByNumber = blockNumber => new Promise((resolve, reject) => {
    requester.get(`${constants.urls.ropsten}?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber}&boolean=true`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult.result);
      })
      .catch(err => reject(err));
  });

  return {
    getETHUSDPrice,
    getTransactionByHash,
    getBlockByNumber,
  };
};

module.exports = { etherScanServices };
