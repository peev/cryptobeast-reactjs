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
    return Number(BigNumberService.difference(
      dataValue,
      benchmarkValue,
    ));
  },

  getBeta(benchmarkData: Array<number>, data: Array<number>) {
    if (data && data.length > 0 && benchmarkData && benchmarkData.length > 0 && data.length === benchmarkData.length) {
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

  getAssetVariance(data: Array<number>) {
    const returns = [];
    for (let i = 0; i < data.length; i += 1) {
      if (i > 0) {
        returns.push(BigNumberService.quotient(BigNumberService.difference(data[i], data[i - 1]), data[i - 1]));
      }
    }
    const mean = BigNumberService.quotient(returns.reduce((acc: number, obj: number) => BigNumberService.sum(acc, obj), 0), data.length - 1);
    const resultArr = [];
    for (let i = 0; i < returns.length; i += 1) {
      resultArr.push(BigNumberService.pow(BigNumberService.difference(returns[i], mean), 2));
    }
    return BigNumberService.quotient(resultArr.reduce((acc: number, obj: number) => BigNumberService.sum(acc, obj), 0), returns.length);
  },

  getAssetReturn(data: Array<number>) {
    const result = [];
    for (let i = 0; i < data.length; i += 1) {
      if (i > 0) {
        result.push(BigNumberService.quotient(BigNumberService.difference(data[i], data[i - 1]), data[i - 1]));
      }
    }
    return result;
  },

  getPortfolioVariance(data: Array<Object>) {
    const allData = data.map((item: Object) => item.data);
    const weights = data.map((item: Object) => item.weight);
    const returns = allData.map((item: Array<number>) => this.getAssetReturn(item));
    const variances = returns.map((item: Array<number>) => ubique.varc(item));
    const stDeviatiions = returns.map((item: Array<number>) => ubique.std(item));
    const assets = data.map((item: Object, i: number) =>
      ({ weight: weights[i], variance: variances[i], stDev: stDeviatiions[i] }));

    const finalArr = [];
    for (let i = 0; i < returns.length; i += 1) {
      for (let j = i + 1; j < returns.length; j += 1) {
        const cov = ubique.cov(returns[i], returns[j])[0][1];
        const weightsMultiply = BigNumberService.product(assets[i].weight, assets[j].weight);
        const weightProductMultCov = BigNumberService.product(weightsMultiply, cov);
        const multiplyByTwo = BigNumberService.product(weightProductMultCov, 2);
        finalArr.push(multiplyByTwo);
      }
    }

    for (let i = 0; i < data.length; i += 1) {
      finalArr.push(BigNumberService.product(assets[i].weight, assets[i].variance));
    }

    return finalArr.reduce((acc: number, obj: number) => BigNumberService.sum(acc, obj), 0);
  },
};

export default Statistic;
