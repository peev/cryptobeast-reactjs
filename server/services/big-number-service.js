const bigNumberService = () => {
  const BigNumber = require('bignumber.js');

  const sum = (a, b) => (new BigNumber(a).plus(new BigNumber(b)).toNumber());

  const difference = (a, b) => (new BigNumber(a).minus(new BigNumber(b)).toNumber());

  const product = (a, b) => (new BigNumber(a).multipliedBy(new BigNumber(b)).toNumber());

  const quotient = (a, b) => (new BigNumber(a).dividedBy(new BigNumber(b)).toNumber());

  const gweiToEth = gwei => new BigNumber(String(gwei)).shiftedBy(-18);

  const toNumber = number => new BigNumber(String(number)).toNumber();

  return {
    sum,
    difference,
    product,
    quotient,
    gweiToEth,
    toNumber,
  };
};

module.exports = bigNumberService;
