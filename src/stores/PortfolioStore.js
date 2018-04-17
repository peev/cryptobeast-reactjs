import { observable, action, computed } from 'mobx';
import requester from '../services/requester';
import MarketStore from './MarketStore';

class PortfolioStore {
  @observable portfolios;
  @observable selectedPortfolio;
  @observable selectedPortfolioId;
  @observable currentPortfolioAssets;

  @observable currentPortfolioSharePrice;


  constructor() {
    this.portfolios = [];
    this.selectedPortfolio = null;
    this.selectedPortfolioId = null;
    this.currentPortfolioAssets = null;
    this.currentPortfolioSharePrice = 0;

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
      return `$ ${result}`;
    }

    return 0;
  }

  @computed
  get summaryUsdEquivalent() {
    if (this.selectedPortfolio) {
      const result = (this.selectedPortfolio.cost * MarketStore.baseCurrencies[3].last).toFixed(2);
      return `$ ${result}`;
    }

    return 0;
  }

  @computed
  get summaryTotalInvestment() {
    if (this.selectedPortfolio) {
      console.log(this.selectedPortfolio);
      return this.selectedPortfolio.shares;
    }

    return 0;
  }

  @computed
  get summaryTotalProfitLoss() {
    if (this.selectedPortfolio) {
      console.log(this.selectedPortfolio);
      return this.selectedPortfolio.shares;
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
