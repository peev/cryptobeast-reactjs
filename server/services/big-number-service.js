const bigNumberService = () => {
  const BigNumber = require('bignumber.js');

  const isBigNumber = number => number instanceof BigNumber;

  const bigNum = number => (isBigNumber(number) ? new BigNumber(String(number)) : new BigNumber(String(0)));

  const sum = (a, b) => bigNum(a).plus(bigNum(b));

  const difference = (a, b) => bigNum(a).minus(bigNum(b));

  const product = (a, b) => bigNum(a).multipliedBy(bigNum(b));

  const quotient = (a, b) => bigNum(a).dividedBy(bigNum(b));

  return {
    bigNum,
    sum,
    difference,
    product,
    quotient,
  };
};

module.exports = bigNumberService;
