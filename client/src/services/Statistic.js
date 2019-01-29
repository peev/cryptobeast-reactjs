// @flow
import BigNumberService from './BigNumber';

const Statistic = {

  getMean(data: Array<number>) {
    const sum = data.reduce((acc: number, obj: number) => (BigNumberService.sum(acc, obj)), 0);
    return BigNumberService.quotient(sum, data.length);
  },

  getVariance(data: Array<number>) {
    const mean = this.getMean(data);
    const sum = data.reduce((acc: number, obj: number) =>
      BigNumberService.sum(acc, BigNumberService.pow(BigNumberService.difference(obj, mean), 2)), 0);
    return BigNumberService.quotient(sum, data.length);
  },

  getStdDev() {
    return Math.sqrt(this.getVariance());
  },

  // median() {
  //    Arrays.sort(data);
  //    if (data.length % 2 == 0)
  //       return (data[(data.length / 2) - 1] + data[data.length / 2]) / 2.0;
  //    return data[data.length / 2];
  // }
}

export default Statistic;
