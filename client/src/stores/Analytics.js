import { observable, action } from 'mobx';
import PortfolioStore from './PortfolioStore';

class Analytics {
  @observable currentPortfolioPriceHistoryForPeriod;
  @observable selectedTimeInPerformance;
  @observable riskPeriod;
  @observable riskBenchmark;
  @observable riskCurrency;

  constructor() {
    this.currentPortfolioPriceHistoryForPeriod = [];
    this.selectedTimeInPerformance = '';
    this.riskPeriod = 30;
    this.riskBenchmark = 'ETH';
    this.riskCurrency = 'USD';
  }

  @action
  selectTimeInPerformance(value) {
    this.selectedTimeInPerformance = value;
  }

  @action.bound
  currentPriceHistory() {
    return this.currentPortfolioPriceHistoryForPeriod.length > 0 ?
      this.currentPortfolioPriceHistoryForPeriod :
      PortfolioStore.currentPortfolioPrices;
  }
}

export default new Analytics();
