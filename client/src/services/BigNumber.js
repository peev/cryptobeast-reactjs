import { BigNumber } from 'bignumber.js';

const BigNumberService = {
  gweiToEth: gwei => new BigNumber(String(gwei)).shiftedBy(-18).toPrecision(),

  tokenToEth: (token, decimals) => new BigNumber(String(token)).shiftedBy(-Number(decimals)).toPrecision(),

  toNumber: number => new BigNumber(String(number)).toPrecision(),
};

export default BigNumberService;
