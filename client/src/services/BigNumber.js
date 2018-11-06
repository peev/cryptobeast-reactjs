import { BigNumber } from 'bignumber.js';

const BigNumberService = {
  gweiToEth: gwei => new BigNumber(String(gwei)).shiftedBy(-18),

  tokenToEth: (token, decimals) => new BigNumber(String(token)).shiftedBy(-decimals),

  toNumber: number => new BigNumber(String(number)).toNumber(),

  toFixed: number => new BigNumber(String(number)).toFixed(),

  toFixedParam: (number, fixedParam) => new BigNumber(String(number)).toFixed(fixedParam),
};

export default BigNumberService;
