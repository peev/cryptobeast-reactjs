import { observable, action, computed } from 'mobx';
import requester from '../services/requester';

class PortfolioStore {
  @observable
  selectedPortfolio = null;

  @observable
  portfolios = {};

  @observable
  selectedPortfolioId = null;

  @observable
  selectedPortfolio = null;

  constructor() {
    // eslint-disable-next-line no-unused-expressions
    this.getPortfolios; // gets portfolios at app init
  }

  @computed
  getLength() {
    return Object.keys(this.portfolios).length;
  }

  @computed get
  currentPortfolios() {
    return this.portfolios;
  }

  @action.bound
  selectPortfolio(id, index) {
    this.selectedPortfolioId = id;

    // eslint-disable-next-line array-callback-return
    Object.keys(this.portfolios).map((key) => {
      // Returns only selected element
      if (this.portfolios[key].id === id) {
        this.selectedPortfolio = { ...this.portfolios[key] };
      }
    });
    console.log(this.selectedPortfolio);
  }

  @computed get
  getPortfolios() {
    return requester.Portfolio.getAll()
      .then(this.onPortfoliosLoaded)
      .catch(this.onError);
  }

  @action.bound
  onPortfoliosLoaded(result) {
    this.portfolios = { ...result.data };
  }

  @action
  createPortfolio(portfolioName) {
    requester.Portfolio.create(portfolioName)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        this.getPortfolios; // gets new portfolios
      })
      .catch(this.onError);
  }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  onError(err) {
    console.log(err);
  }
}

export default new PortfolioStore();
