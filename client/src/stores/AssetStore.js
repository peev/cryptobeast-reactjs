// @flow
/* eslint no-console: 0 */
import { observable, action, computed } from 'mobx';
import ubique from 'ubique';
import requester from '../services/requester';

import PortfolioStore from './PortfolioStore';
import MarketStore from './MarketStore';
import LoadingStore from './LoadingStore';
import BigNumberService from '../services/BigNumber';
import CurrencyStore from './CurrencyStore';
import Statistic from '../services/Statistic';
import Analytics from './Analytics';

class AssetStore {
  @observable assetHistory;
  @observable assetsValueHistory;

  constructor() {
    this.assetHistory = [];
    this.assetsValueHistory = [];
  }

  @action.bound
  getAssetsValueHistory() {
    this.assetsValueHistory = [];
    requester.Asset.getAssetsValueHistory(PortfolioStore.selectedPortfolioId)
      .then(action((result: object) => {
        this.assetsValueHistory = result.data;
      }));
  }

  @computed
  get protfolioAssetsTokenNames() {
    if (this.assetsValueHistory.length && this.assetsValueHistory.length > 0) {
      const assets = this.assetsValueHistory[this.assetsValueHistory.length - 1].assets.filter((asset: Object) => asset.amount > 0);
      const result = assets.map((asset: Object) => asset.tokenName).sort();
      return result;
    }
    return [];
  }

  getAssetTotals = (assetName: string, data: Array<Object>) => {
    if (data.length && data.length > 0) {
      const assetTotals = [];
      data.map((item: object) =>
        item.assets.map((asset: object) =>
          ((asset.tokenName === assetName) ? assetTotals.push(asset.total) : null)));
      return assetTotals;
    }

    return [];
  }

  getAssetTotalsUSD = (assetName: string, data: Array<Object>) => {
    if (data.length && data.length > 0) {
      const assetTotals = [];
      data.map((item: object) =>
        item.assets.map((asset: object) =>
          ((asset.tokenName === assetName) ? assetTotals.push(asset.totalUsd) : null)));
      return assetTotals;
    }
    return [];
  }

  getAssetTotalsPrice = (assetName: string, currency: string, benchmarkData: Array<number>) => {
    if (this.assetsValueHistory.length && this.assetsValueHistory.length > 0) {
      const assetTotals = [];
      this.assetsValueHistory.map((item: object, index: number) =>
        item.assets.map((asset: object) => {
          // assume that there is only ETH and USD
          const curr = Analytics.riskCurrency === 'ETH' ? asset.price : BigNumberService.product(asset.price, benchmarkData[index]);
          return (asset.tokenName === assetName) ? assetTotals.push(curr) : null;
        }));
      return assetTotals;
    }
    return [];
  }

  @computed
  get assetsStdSkewnessKurtosis() {
    if (this.assetsValueHistory.length && this.assetsValueHistory.length > 0) {
      const data = this.assetsValueHistory.map((item: Object) => item);
      // Slice data according selected period
      if (data.length > Analytics.riskPeriod + 1) {
        const startIdx = data.length - (Analytics.riskPeriod + 1);
        data.splice(0, startIdx);
      }
      const std = [];
      const skewness = [];
      const kurtosis = [];
      const assets = data[data.length - 1].assets.filter((asset: Object) => asset.amount > 0);
      const items = assets.map((asset: Object) => asset.tokenName).sort();

      // assume that there is only ETH and USD
      const benchmarkData = Analytics.riskCurrency === 'ETH' ?
        MarketStore.ethHistory.map(() => 1) :
        MarketStore.ethHistory.map((item: Object) => item.priceUsd);

      // eslint-disable-next-line array-callback-return
      items.map((item: string) => {
        // assume that there is only ETH and USD
        if (Analytics.riskCurrency === 'ETH') {
          const assetTotals = data.map((el: Object) => el.assets.filter((asset: Object) => asset.tokenName === item)[0].price);
          const returns = Statistic.getAssetReturn(assetTotals);
          std.push(Number(BigNumberService.floorFour(BigNumberService.gweiToEth(ubique.std(returns)))) || 0);
          skewness.push(Number(BigNumberService.floorFour(BigNumberService.gweiToEth(ubique.skewness(returns)))) || 0);
          kurtosis.push(Number(BigNumberService.floorFour(BigNumberService.gweiToEth(ubique.kurtosis(returns)))) || 0);
        } else {
          const assetTotals = data.map((el: Object, index: number) =>
            BigNumberService.product(el.assets.filter((asset: Object) => asset.tokenName === item)[0].price, benchmarkData[index]));
          const returns = Statistic.getAssetReturn(assetTotals);
          std.push(Number(BigNumberService.floor(ubique.std(returns))) || 0);
          skewness.push(Number(BigNumberService.floor(ubique.skewness(returns))) || 0);
          kurtosis.push(Number(BigNumberService.floor(ubique.kurtosis(returns))) || 0);
        }
      });
      const result = { std, skewness, kurtosis };
      return result;
    }

    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  @action
  // eslint-disable-next-line class-methods-use-this
  assetVariance(assetsTotal: Array<number>) {
    if (assetsTotal.length > Analytics.riskPeriod) {
      const startIdx = (assetsTotal.length - 1) - Analytics.riskPeriod;
      assetsTotal.splice(0, startIdx);
    }
    return Statistic.getAssetVariance(assetsTotal);
  }

  @computed
  get assetsVariance() {
    if (this.assetsValueHistory.length && this.assetsValueHistory.length > 0 &&
      MarketStore.ethHistory && MarketStore.ethHistory.length > 0) {
      const assets = this.assetsValueHistory[this.assetsValueHistory.length - 1].assets.filter((asset: Object) => asset.amount > 0);
      const items = assets.map((asset: Object) => asset.tokenName).sort();

      return items.map((assetName: string) => {
        // assume that there is only ETH and USD
        const benchmarkData = Analytics.riskCurrency === 'ETH' ?
          MarketStore.ethHistory.map(() => 1) :
          MarketStore.ethHistory.map((item: Object) => item.priceUsd);

        const assetsTotal = this.getAssetTotalsPrice(assetName, Analytics.riskCurrency, benchmarkData);

        // If data starts with 0 (no records);
        const assetsTotalStartIndex = assetsTotal.findIndex((item: Object) => item !== 0);
        if (assetsTotalStartIndex > 0) {
          assetsTotal.splice(0, assetsTotalStartIndex);
          benchmarkData.splice(0, assetsTotalStartIndex);
        }
        // If data is shorter than benchmark data
        if (assetsTotal.length < benchmarkData.length) {
          const rem = benchmarkData.length - assetsTotal.length;
          benchmarkData.splice(rem, assetsTotal.length);
        }

        // Calculate variance before data splice because it requires data length + 1
        const dataForVariance = assetsTotal.map((item: number) => item);
        const variance = this.assetVariance(dataForVariance);

        // Slice data according selected period
        if (assetsTotal.length > Analytics.riskPeriod) {
          const startIdx = assetsTotal.length - Analytics.riskPeriod;
          assetsTotal.splice(0, startIdx);
          benchmarkData.splice(0, startIdx);
        }

        const assetObj = assets.find((as: Object) => as.tokenName === assetName);

        const asset = {
          ticker: assetName,
          totalUsd: assetObj.totalUsd,
          totalEth: assetObj.total,
          alpha: Statistic.getAlpha(benchmarkData, assetsTotal),
          beta: Statistic.getBeta(benchmarkData, assetsTotal),
          rsq: null,
          adjR: null,
          variance,
        };
        return asset;
      });
    }
    return [];
  }

  @action
  getAssetHistoryByTokenIdAndPeriod(tokenName: string, period: string) {
    if (CurrencyStore.currencies && CurrencyStore.currencies.length > 0) {
      const { tokenId } = CurrencyStore.currencies.filter((currency: object) => currency.tokenName === tokenName)[0];
      LoadingStore.setShowLoading(true);
      requester.Asset.getAssetHistory(tokenId, period)
        .then(action((result: object) => {
          this.assetHistory = result.data.reverse();
          LoadingStore.setShowLoading(false);
        }))
        .catch(action((err: object) => {
          LoadingStore.setShowLoading(false);
          console.log(err);
        }));
    }
  }

  @computed
  get assetHistoryBrakedownDates() {
    if (this.assetHistory.length && this.assetHistory.length > 0) {
      const result = this.assetHistory.map((el: object) => {
        const date = new Date(el.date);
        let month = date.getUTCMonth() + 1;
        if (month.length === 1) {
          month = `0${month}`;
        }
        return `${date.getDate()}-${month}-${date.getFullYear()}`;
      });
      result.shift();
      return result;
    }
    return [];
  }

  @computed
  get assetProfitLoss() {
    if (this.assetHistory.length && this.assetHistory.length > 0) {
      const result = this.assetHistory.map((el: object, index: number) => {
        if (index === 0) {
          return 0;
        } else {
          return Number(BigNumberService
            .floor(BigNumberService
              .product(BigNumberService
                .quotient(BigNumberService
                  .difference(el.value, this.assetHistory[index - 1].value), this.assetHistory[index - 1].value), 100)));
        }
      });
      result.shift();
      return result;
    }
    return [];
  }
}

export default new AssetStore();
