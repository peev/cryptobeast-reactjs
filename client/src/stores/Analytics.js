import { observable, action, computed } from 'mobx';
import requester from '../services/requester';
import PortfolioStore from './PortfolioStore';
import MarketStore from './MarketStore';

class Analytics {
  @observable currentPortfolioPriceHistoryAll;
  @observable currentPortfolioClosingSharePrices;
  @observable currentPortfolioPriceHistoryForPeriod;
  @observable selectedTimeInPerformance;

  constructor() {
    this.currentPortfolioPriceHistoryAll = [];
    this.currentPortfolioClosingSharePrices = [];
    this.currentPortfolioPriceHistoryForPeriod = [];
    this.selectedTimeInPerformance = '';
  }

  @computed
  get performanceMin() {
    if (MarketStore.baseCurrencies.length > 0 &&
      (this.currentPortfolioPriceHistoryForPeriod.length > 0 ||
        this.currentPortfolioPriceHistoryAll.length > 0)) {
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
        this.currentPortfolioPriceHistoryAll.length > 0)) {
      const currentArray = this.currentPriceHistory();
      const valueOfUSD = MarketStore.baseCurrencies[3].last;

      return Math.max(...currentArray.map(el => el.price)) * valueOfUSD;
    }

    return 0;
  }

  @computed
  get performanceATH() {
    if (MarketStore.baseCurrencies.length > 0 &&
      this.currentPortfolioPriceHistoryAll.length > 0) {
      const currentArray = this.currentPortfolioPriceHistoryAll;
      const valueOfUSD = MarketStore.baseCurrencies[3].last;

      return Math.max(...currentArray.map(el => el.price)) * valueOfUSD;
    }

    return 0;
  }

  @computed
  get performanceProfitLoss() {
    if (this.currentPortfolioPriceHistoryForPeriod.length > 0 ||
      this.currentPortfolioPriceHistoryAll.length > 0) {
      const currentArray = this.currentPriceHistory();

      return ((currentArray[currentArray.length - 1].price - currentArray[0].price) / currentArray[0].price) * 100;
    }

    return 0;
  }

  @computed
  get performanceAverageChange() {
    if (this.currentPortfolioPriceHistoryForPeriod.length > 0 ||
      this.currentPortfolioPriceHistoryAll.length > 0) {
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
  get performanceLast24H() {
    if (this.currentPortfolioPriceHistoryAll.length > 0) {
      const currentArray = this.currentPortfolioPriceHistoryAll;
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const result = currentArray.filter(el => date <= new Date(el.createdAt));

      return ((result[result.length - 1].price - result[0].price) / result[0].price) * 100;
    }

    return 0;
  }

  @computed
  get performanceLast7D() {
    if (this.currentPortfolioPriceHistoryAll.length > 0) {
      const currentArray = this.currentPortfolioPriceHistoryAll;
      const date = new Date();
      date.setDate(date.getDate() - 7);
      const result = currentArray.filter(el => date <= new Date(el.createdAt));

      return (((result[result.length - 1].price - result[0].price) / result[0].price) / 7) * 100;
    }

    return 0;
  }

  @computed
  // eslint-disable-next-line class-methods-use-this
  get performanceTopPerformer() {
    // NOTE: add read data
    return '-';
  }

  @computed
  get currentPortfolioPriceHistoryBreakdown() {
    if (PortfolioStore.selectedPortfolio &&
      (this.currentPortfolioPriceHistoryForPeriod.length > 0 ||
        this.currentPortfolioPriceHistoryAll.length > 0)) {
      const currentArray = this.currentPriceHistory();

      return currentArray.map((el) => {
        const timeOfCreation = Math.round(new Date(el.createdAt).getTime());
        const usdEquivalent = el.price * MarketStore.baseCurrencies[3].last;
        const usdEquivalentRounded = Number(`${Math.round(`${usdEquivalent}e2`)}e-2`);

        return [timeOfCreation, usdEquivalentRounded, null];
      });
    }

    return [];
  }

  @computed
  get currentPortfolioClosingSharePricesBreakdown() {
    if (PortfolioStore.selectedPortfolio && this.currentPortfolioClosingSharePrices.length > 0) {
      return this.currentPortfolioClosingSharePrices
        .filter(el => el.isClosingPrice === true)
        .map((el) => {
          const timeOfCreation = Math.round(new Date(el.createdAt).getTime());
          return [timeOfCreation, el.price, null];
        });
    }

    return [];
  }

  @action
  selectTimeInPerformance(value) {
    this.selectedTimeInPerformance = value;
  }

  @action.bound
  getPortfolioPriceHistory() {
    const searchedHistoryItems = {
      portfolioId: PortfolioStore.selectedPortfolioId,
    };

    requester.Portfolio.getPriceHistory(searchedHistoryItems)
      .then(action((result) => {
        this.currentPortfolioPriceHistoryAll = result.data;
      }));
  }

  @action.bound
  getPortfolioPriceHistoryForTimePeriod() {
    const searchedHistoryItems = {
      portfolioId: PortfolioStore.selectedPortfolioId,
      selectedPeriod: this.selectedTimeInPerformance,
    };

    requester.Portfolio.getPriceHistoryForPeriod(searchedHistoryItems)
      .then(action((result) => {
        this.currentPortfolioPriceHistoryForPeriod = result.data;
      }));
  }

  @action.bound
  getClosingSharePriceHistory() {
    const searchedHistoryItems = {
      portfolioId: PortfolioStore.selectedPortfolioId,
      isClosingPrice: true,
    };

    requester.Portfolio.getSharePriceHistory(searchedHistoryItems)
      .then(action((result) => {
        this.currentPortfolioClosingSharePrices = result.data;
      }));
  }

  @action.bound
  currentPriceHistory() {
    return this.currentPortfolioPriceHistoryForPeriod.length > 0 ?
      this.currentPortfolioPriceHistoryForPeriod :
      this.currentPortfolioPriceHistoryAll;
  }
}

export default new Analytics();
