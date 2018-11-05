import { BigNumber } from 'bignumber.js';

const BigNumberService = {
  gweiToEth: gwei => new BigNumber(String(gwei)).shiftedBy(-18).toFixed(),

  tokenToEth: (token, decimals) => new BigNumber(String(token)).shiftedBy(-decimals).toFixed(),

  toNumber: number => new BigNumber(String(number)).toFixed(),

  toFixed: number => new BigNumber(String(number)).toFixed(),

  toFixedParam: (number, fixedParam) => new BigNumber(String(number)).toFixed(fixedParam),
};

export default BigNumberService;
