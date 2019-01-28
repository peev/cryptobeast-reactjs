import { observable, action, computed } from 'mobx';
import PortfolioStore from './PortfolioStore';
import MarketStore from './MarketStore';

class Analytics {
  @observable currentPortfolioBTCPriceHistory;
  @observable currentPortfolioClosingSharePrices;
  @observable currentPortfolioPriceHistoryForPeriod;
  @observable selectedTimeInPerformance;

  constructor() {
    this.currentPortfolioBTCPriceHistory = [];
    this.currentPortfolioClosingSharePrices = [];
    this.currentPortfolioPriceHistoryForPeriod = [];
    this.selectedTimeInPerformance = '';
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

  @computed
  get performanceAverageChange() {
    if (this.currentPortfolioPriceHistoryForPeriod.length > 0 ||
      PortfolioStore.currentPortfolioPrices.length > 0) {
      const currentArray = this.currentPriceHistory();

      let time;
      switch (this.selectedTimeInPerformance) {
        case '1d':
          time = 1;
          break;
        case '1m':
          time = 31;
          break;
        case '1y':
          time = 365;
          break;
        default:
          time = 365;
          break;
      }

      return (((currentArray[currentArray.length - 1].price - currentArray[0].price) / currentArray[0].price) / time) * 100;
    }

    return 0;
  }

  @computed
  get currentPortfolioPriceHistoryBreakdown() {
    if (PortfolioStore.selectedPortfolio && MarketStore.baseCurrencies.length > 0 &&
      (this.currentPortfolioPriceHistoryForPeriod.length > 0 ||
        PortfolioStore.currentPortfolioPrices.length > 0)) {
      return PortfolioStore.currentPortfolioPrices
        .sort((a, b) => (a.id - b.id))
        .map((el) => {
          const timeOfCreation = Math.round(new Date(el.createdAt).getTime());
          const usdEquivalent = el.price * MarketStore.baseCurrencies[3].last;
          const usdEquivalentRounded = Number(`${Math.round(`${usdEquivalent}e2`)}e-2`);

          return [timeOfCreation, usdEquivalentRounded, null];
        });
    }

    return [];
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
