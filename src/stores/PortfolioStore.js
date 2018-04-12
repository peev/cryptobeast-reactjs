import { observable, action, computed } from 'mobx';
import requester from '../services/requester';

class PortfolioStore {
  @observable portfolios;
  @observable selectedPortfolio;
  @observable selectedPortfolioId;
  @observable currentPortfolioAssets;

  @observable currentPortfolioSharePrice;


  constructor() {
    this.portfolios = {};
    this.selectedPortfolio = null;
    this.selectedPortfolioId = null;
    this.currentPortfolioAssets = null;
    this.currentPortfolioSharePrice = 0;

    // eslint-disable-next-line no-unused-expressions
    this.getPortfolios(); // gets portfolios at app init
  }

  @computed
  get getLength() {
    return Object.keys(this.portfolios).length;
  }

  @computed
  get getAllPortfolios() {
    return this.portfolios;
  }

  @computed
  get currentPortfolio() {
    return this.selectedPortfolio;
  }

  @action
  getCurrentPortfolio() {
    return this.selectedPortfolio;
  }

  @action
  selectPortfolio(id) {
    this.selectedPortfolioId = id;

    // eslint-disable-next-line array-callback-return
    Object.keys(this.portfolios).map((key) => {
      // Returns only selected element
      if (this.portfolios[key].id === id) {
        this.selectedPortfolio = { ...this.portfolios[key] };
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
