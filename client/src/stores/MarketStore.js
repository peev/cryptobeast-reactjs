// @flow
/* eslint no-console: 0 */
import { observable, action, computed } from 'mobx';
import requester from '../services/requester';
import PortfolioStore from './PortfolioStore';

class MarketStore {
  @observable marketPriceHistory;
  @observable ethToUsd;
  @observable ethHistory;

  constructor() {
    this.marketPriceHistory = {};
    this.ethToUsd = null;
    this.ethHistory = [];
  }

  init() {
    this.getEthToUsd();
  }

  @action.bound
  getTickersFromCoinMarketCap() {
    return requester.Market.getTickersFromCoinMarketCap()
      .then(this.convertMarketPriceHistory)
      .catch((err: object) => console.log(err));
  }

  @action.bound
  getEthToUsd() {
    return requester.Market.getEthToUsd()
      .then((result: Object) => {
        this.ethToUsd = result.data;
      })
      .catch((err: object) => console.log(err));
  }

  @action.bound
  getEthHistory() {
    if (PortfolioStore.selectedPortfolioId !== null && PortfolioStore.selectedPortfolioId > 0) {
      requester.Market.getEthHistory(PortfolioStore.selectedPortfolioId)
        .then((result: Object) => {
          this.ethHistory = result.data;
        })
        .catch((err: object) => console.log(err));
    }
    this.ethHistory = [];
  }

  @computed
  get ethHistoryBreakdown() {
    if (this.ethHistory.length > 0) {
      const result = [];
      this.ethHistory.forEach((item: Object) => {
        result.push(item.priceUsd);
      });
      return result;
    }
    return [];
  }

  @action.bound
  convertMarketPriceHistory(response: object) {
    const result = {};
    // eslint-disable-next-line no-return-assign
    response.data.forEach((el: object) => result[el.currency] = el);
    this.marketPriceHistory = result;
  }
}

export default new MarketStore();
