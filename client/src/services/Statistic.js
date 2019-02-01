// @flow
import ubique from 'ubique';
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

  getStdDev(data: Array<number>) {
    return BigNumberService.pow(this.getVariance(data), 2);
  },

  getAlpha(benchmarkData: Array<number>, data: Array<number>) {
    const benchmarkValue = BigNumberService.product(
      BigNumberService.quotient(
        BigNumberService.difference(
          benchmarkData[benchmarkData.length - 1],
          benchmarkData[0],
        ),
        benchmarkData[0],
      ),
      100,
    );
    const dataValue = BigNumberService.product(
      BigNumberService.quotient(
        BigNumberService.difference(
          data[data.length - 1],
          data[0],
        ),
        data[0],
      ),
      100,
    );
    return Number(BigNumberService.toFixedParam(
      BigNumberService.difference(
        dataValue,
        benchmarkValue,
      ),
      2,
    ));
  },

  getBeta(benchmarkData: Array<number>, data: Array<number>) {
    if (data && data.length > 0 && benchmarkData && benchmarkData.length > 0) {
      // console.log(data)
      // console.log(benchmarkData);
      const covar = ubique.cov(benchmarkData, data, 0);
      const variance = ubique.varc(benchmarkData);
      return BigNumberService.quotient(covar[0][1], variance);
    }

    return 0;
  },

  getPortfolioBeta(totalWeight: number, data: Array<number>) {
    return data.reduce(
      (acc: number, item: Object) =>
        BigNumberService.product(
          BigNumberService.quotient(
            item.value,
            totalWeight,
          ),
          item.beta,
        ),
      0,
    );
  },

  // median() {
  //    Arrays.sort(data);
  //    if (data.length % 2 == 0)
  //       return (data[(data.length / 2) - 1] + data[data.length / 2]) / 2.0;
  //    return data[data.length / 2];
  // }
};

export default Statistic;
