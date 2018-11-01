const bigNumberService = () => {
  const BigNumber = require('bignumber.js');

  const isBigNumber = number => number instanceof BigNumber;

  const bigNum = number => (isBigNumber(number) ? new BigNumber(String(number)) : new BigNumber(String(0)));

  return {
    bigNum,
  };
};

module.exports = bigNumberService;
