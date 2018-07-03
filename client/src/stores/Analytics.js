import { observable, action, computed, onBecomeObserved } from 'mobx';
import requester from '../services/requester';
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

    onBecomeObserved(this, 'currentPortfolioClosingSharePrices', this.getClosingSharePriceHistory);
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
  // eslint-disable-next-line class-methods-use-this
  get performanceLast24H() {
    if (PortfolioStore.currentPortfolioPrices.length > 0) {
      const currentArray = PortfolioStore.currentPortfolioPrices;
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const result = currentArray.filter(el => date <= new Date(el.createdAt));
      if (result.length > 0) {
        return ((result[result.length - 1].price - result[0].price) / result[0].price) * 100;
      }
    }

    return 0;
  }

  @computed
  // eslint-disable-next-line class-methods-use-this
  get performanceLast7D() {
    if (PortfolioStore.currentPortfolioPrices.length > 0) {
      const currentArray = PortfolioStore.currentPortfolioPrices;
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

  @computed
  get currentPortfolioPriceChangeBreakdown() {
    if (this.currentPortfolioPriceHistoryBreakdown.length > 0) {
      const initialPortfolioCost = this.currentPortfolioPriceHistoryBreakdown[0][1];

      return this.currentPortfolioPriceHistoryBreakdown
        .map((ph, i) => {
          const currentPrice = ph[1];
          const change = i > 0 ? (((currentPrice - initialPortfolioCost) / initialPortfolioCost) * 100) : 0;
          const value = Number(`${Math.round(`${change}e2`)}e-2`);
          return [ph[0], value, null];
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
  btcPriceHistoryForPeriod() {
    if (PortfolioStore.currentPortfolioPrices.length > 1) {
      const sortedPrices = PortfolioStore.currentPortfolioPrices.slice();
      const portfolioPriceHistory = sortedPrices
        .sort((a, b) => a.id - b.id);
      const firstDate = portfolioPriceHistory[0].createdAt;
      const secondDate = portfolioPriceHistory[portfolioPriceHistory.length - 1].createdAt;
      let fromDate = firstDate < secondDate ? firstDate : secondDate;
      fromDate = fromDate.toString().substr(0, 10);
      const toDate = firstDate > secondDate ? firstDate : secondDate;

      requester.Market.getBaseTickerHistory({ fromDate, toDate })
        .then(action((result) => {
          const convertedData = result.data
            .sort((a, b) => a.id - b.id)
            .map((el) => {
              const timeOfCreation = Math.round(new Date(el.createdAt).getTime());
              return [timeOfCreation, el.last, null];
            });
          this.currentPortfolioBTCPriceHistory = convertedData;
        }))
        .catch(error => console.log(error));
    } else {
      this.currentPortfolioBTCPriceHistory = [];
    }
  }

  @computed
  get currentBtcPriceChangeBreakdown() {
    if (this.currentPortfolioBTCPriceHistory.length > 0) {
      const initialBtcPrice = this.currentPortfolioBTCPriceHistory[0][1];
      const btcPriceHistoryBreakdown = this.currentPortfolioBTCPriceHistory
        .map((ph, i) => {
          const currentPrice = ph[1];
          const change = i > 0 ? (((currentPrice - initialBtcPrice) / initialBtcPrice) * 100) : 0;
          const value = Number(`${Math.round(`${change}e2`)}e-2`);
          return [ph[0], value, null];
        });

      return btcPriceHistoryBreakdown;
    }

    return [];
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
      PortfolioStore.currentPortfolioPrices;
  }
}

export default new Analytics();
