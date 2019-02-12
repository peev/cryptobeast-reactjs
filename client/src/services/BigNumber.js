import { BigNumber } from 'bignumber.js';

const BigNumberService = {
  gweiToEth: gwei => new BigNumber(String(gwei)).shiftedBy(-18),

  tokenToEth: (token, decimals) => new BigNumber(String(token)).shiftedBy(-decimals),

  toNumber: number => new BigNumber(String(number)).toNumber(),

  toFixed: number => new BigNumber(String(number)).toFixed(),

  toFixedParam: (number, fixedParam) => new BigNumber(String(number)).toFixed(fixedParam),

  sum: (a, b) => new BigNumber(a).plus(new BigNumber(b)).toNumber(),

  difference: (a, b) => new BigNumber(a).minus(new BigNumber(b)).toNumber(),

  product: (a, b) => new BigNumber(a).multipliedBy(new BigNumber(b)).toNumber(),

  quotient: (a, b) => new BigNumber(a).dividedBy(new BigNumber(b)).toNumber(),

  pow: (a, b) => new BigNumber(a).pow(new BigNumber(b)).toNumber(),

  floor: number => new BigNumber(Math.floor(new BigNumber(number).multipliedBy(100))).dividedBy(100).toFixed(2),

  floorFour: number => new BigNumber(Math.floor(new BigNumber(number).multipliedBy(10000))).dividedBy(10000).toFixed(4),

  sqrt: number => new BigNumber(String(number)).sqrt(),
};

export default BigNumberService;
