import { observable, action, computed } from 'mobx';
import PortfolioStore from './PortfolioStore';
import MarketStore from './MarketStore';

class Analytics {
  @observable currentPortfolioBTCPriceHistory;
  @observable currentPortfolioClosingSharePrices;
  @observable currentPortfolioPriceHistoryForPeriod;
  @observable selectedTimeInPerformance;
  @observable riskPeriod;
  @observable riskBenchmark;
  @observable riskCurrency;

  constructor() {
    this.currentPortfolioBTCPriceHistory = [];
    this.currentPortfolioClosingSharePrices = [];
    this.currentPortfolioPriceHistoryForPeriod = [];
    this.selectedTimeInPerformance = '';
    this.riskPeriod = 30;
    this.riskBenchmark = 'ETH';
    this.riskCurrency = 'USD';
  }

  @computed
  get performanceMin() {
    if (MarketStore.baseCurrencies.length > 0 &&
      (this.currentPortfolioPriceHistoryForPeriod.length > 0 ||
        PortfolioStore.currentPortfolioPrices.length > 0)) {
      const currentArray = this.currentPriceHistory();
      const valueOfUSD = MarketStore.baseCurrencies[3].last;

      return Math.min(...currentArray.map(el => el.price)) * valueOfUSD;
    }

    return 0;
  }

  @computed
  get performanceMax() {
    if (MarketStore.baseCurrencies.length > 0 &&
      (this.currentPortfolioPriceHistoryForPeriod.length > 0 ||
        PortfolioStore.currentPortfolioPrices.length > 0)) {
      const currentArray = this.currentPriceHistory();
      const valueOfUSD = MarketStore.baseCurrencies[3].last;

      return Math.max(...currentArray.map(el => el.price)) * valueOfUSD;
    }

    return 0;
  }

  @computed
  // eslint-disable-next-line class-methods-use-this
  get performanceATH() {
    if (MarketStore.baseCurrencies.length > 0 &&
      PortfolioStore.currentPortfolioPrices.length > 0) {
      const currentArray = PortfolioStore.currentPortfolioPrices;
      const valueOfUSD = MarketStore.baseCurrencies[3].last;

      return Math.max(...currentArray.map(el => el.price)) * valueOfUSD;
    }

    return 0;
  }

  @computed
  get performanceProfitLoss() {
    if (MarketStore.baseCurrencies.length > 0 && (this.currentPortfolioPriceHistoryForPeriod.length > 0 ||
      PortfolioStore.currentPortfolioPrices.length > 0)) {
      const currentArray = this.currentPriceHistory();

      return ((currentArray[currentArray.length - 1].price - currentArray[0].price) / currentArray[0].price) * 100;
    }

    return 0;
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
