import { observable, action, computed } from 'mobx';
import requester from '../services/requester';
import MarketStore from './MarketStore';

class PortfolioStore {
  @observable portfolios;
  @observable selectedPortfolio;
  @observable selectedPortfolioId;
  @observable currentPortfolioAssets;

  @observable currentPortfolioSharePrice;
  @observable selectedPortfolioUsdEquivalent;
  @observable currentPortfolioTotalInvestment;
  @observable selectedPortfolioTotalDifference;
  @observable selectedPortfolioTotalProfitLoss;

  constructor() {
    this.portfolios = [];
    this.selectedPortfolio = null;
    this.selectedPortfolioId = null;
    this.currentPortfolioAssets = null;
    this.currentPortfolioSharePrice = 0;
    this.selectedPortfolioUsdEquivalent = 0;
    this.currentPortfolioTotalInvestment = 0;
    this.selectedPortfolioTotalDifference = 0;
    this.selectedPortfolioTotalProfitLoss = 0;

    // eslint-disable-next-line no-unused-expressions
    this.getPortfolios(); // gets portfolios at app init
  }

  @computed
  get getAllPortfolios() {
    return this.portfolios;
  }

  @computed
  get currentPortfolio() {
    return this.selectedPortfolio;
  }

  @computed
  get summaryTotalNumberOfShares() {
    if (this.selectedPortfolio) {
      return this.selectedPortfolio.shares;
    }

    return 0;
  }

  @computed
  get summarySharePrice() {
    if (this.selectedPortfolio) {
      const result = this.currentPortfolioSharePrice.toFixed(2);
      return result;
    }

    return 0;
  }

  @computed
  get summaryUsdEquivalent() {
    if (this.selectedPortfolio) {
      const result = (this.selectedPortfolio.cost * MarketStore.baseCurrencies[3].last).toFixed(2);
      return result;
    }

    return 0;
  }

  @computed
  get summaryTotalInvestment() {
    if (this.selectedPortfolio && this.selectedPortfolio.transactions.length > 0) {
      let totalAmount = 0;
      this.selectedPortfolio.transactions.forEach((el) => {
        if (el.shares > 0) {
          totalAmount += el.amountInUSD;
        } else {
          totalAmount -= el.amountInUSD;
        }
      });

      return totalAmount.toFixed(2);
    }

    return 0;
  }

  @computed
  get summaryTotalProfitLoss() {
    if (this.selectedPortfolio && this.selectedPortfolio.transactions.length > 0) {
      const result = (((this.summaryUsdEquivalent - this.summaryTotalInvestment) / this.summaryTotalInvestment) * 100).toFixed(2);
      return result;
    }

    return 0;
  }

  @computed
  get summaryPortfolioAssets() {
    if (this.selectedPortfolio && this.selectedPortfolio.assets) {
      const currentAssets = this.selectedPortfolio.assets;
      const usdValue = MarketStore.baseCurrencies[3].last;
      const selectedPortfolioSummary = [];

      currentAssets.forEach((el, i) => {
        const currentRow = [];
        Object.keys(el).map((prop, ind) => {
          // console.log(el, el[prop], prop)
          // Ticker
          if (prop === 'currency') {
            currentRow.push(el[prop]);
          }
          // Holdings
          if (prop === 'balance') {
            currentRow.push(el[prop]);
          }
          // Price(BTC)
          if (ind === 2) {
            const calcPrice = el.lastBTCEquivalent ? el.lastBTCEquivalent : 0;
            currentRow.push(calcPrice);
          }
          // Price(USD)
          if (ind === 3) {
            const calcPrice = el.lastBTCEquivalent ? (el.lastBTCEquivalent * el.balance) : 0;
            currentRow.push(calcPrice);
          }
          // Total Value(USD)
          if (ind === 4) {
            console.log(el, el[prop], prop)

            const calcPrice = el.lastBTCEquivalent ? (el.balance * usdValue) : 0;
            currentRow.push(calcPrice);
          }
        });
        selectedPortfolioSummary.push(currentRow);
      });

      return selectedPortfolioSummary;
    }

    return 0;
  }

  @action
  getCurrentPortfolio() {
    if (this.selectedPortfolio) {
      console.log(this.selectedPortfolio);
      return this.selectedPortfolio.shares;
    }

    return 0;
  }

  @action
  selectPortfolio(id) {
    console.log(id)
    this.selectedPortfolioId = id;

    this.portfolios.forEach((el) => {
      // Returns only selected element
      if (el.id === id) {
        this.selectedPortfolio = { ...el };
      }
    });

    requester.Portfolio.getSharePrice({ id })
      .then(action((sharePrice) => {
        this.currentPortfolioSharePrice = sharePrice.data.sharePrice;
      }));
  }

  @action
  getPortfolios() {
    return requester.Portfolio.getAll()
      .then(action((result) => {
        this.portfolios = result.data;
      }))
      .catch(this.onError);
  }

  @action
  createPortfolio(portfolioName) {
    requester.Portfolio.create(portfolioName)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        this.getPortfolios(); // gets new portfolios
      })
      .catch(this.onError);
  }

  @action
  updatePortfolio(portfolioName, id) {
    requester.Portfolio.update(portfolioName, id)
      .then(() => {
        this.getPortfolios();
      })
      .catch(this.onError);
  }

  @action
  removePortfolio(id) {
    console.log(id);
    requester.Portfolio.delete(id)
      .then(() => {
        this.getPortfolios();
      })
      .catch(this.onError);
  }
  // @action.bound
  // removePortfolio(selectedPortfolio) {
  //   this.portfolios = this.portfolios.filter(i => i !== selectedPortfolio);
  //   this.portfolios.remove(selectedPortfolio);
  // }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  onError(err) {
    console.log(err);
  }
}

export default new PortfolioStore();
