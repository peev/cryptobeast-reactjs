const requester = require('../services/requester-service');

const baseURL = 'https://api.etherscan.io/api';

const etherScanServices = () => {
  const getETHUSDPrice = () => new Promise((resolve) => {
    requester.get(`${baseURL}?module=stats&action=ethprice`)
      .then((response) => {
        const parsedResult = JSON.parse(response);
        resolve(parsedResult.result.ethusd);
      })
      .catch(err => console.log(err)); // eslint-disable-line
  });

  return {
    getETHUSDPrice,
  };
};

module.exports = { etherScanServices };
