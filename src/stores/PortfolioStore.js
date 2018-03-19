import { observable, action, computed } from 'mobx';
import requester from '../services/requester';

class PortfolioStore {
  @observable
  selectedPortfolio = null;

  @observable
  portfolios = {};

  constructor() {
    this.getPortfolios;
  }

  @computed
  getLength() {
    return Object.keys(this.portfolios).length;
  }

  @computed get
  currentPortfolios() {
    return this.portfolios;
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
        this.getPortfolios;
      })
      .catch(this.onError);
  }

  @action.bound
  onError(err) {
    console.log(err);
  }
}

export default new PortfolioStore();
