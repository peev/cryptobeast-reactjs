import { observable, action, computed } from 'mobx';
import requester from '../services/requester';

class PortfolioStore {
  @observable
  selectedPortfolio = null;

  @observable
  portfolios = {};

  @observable
  arePortfoliosLoaded = false;

  constructor() {
    requester.Portfolio.getAll()
      .then(this.onPortfoliosLoaded)
      .catch(this.onError);
  }

  @computed
  getLength() {
    return Object.keys(this.portfolios).length;
  }


  @action.bound
  onPortfoliosLoaded(result) {
    this.portfolios = { ...result.data };
    // this.arePortfoliosLoaded = true;s
  }

  @action
  createPortfolio(portfolioName) {
    // send to api
    requester.Portfolio.create(portfolioName)
      .then((result) => {
        console.log('createPortfolio', result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  @action.bound
  onError(err) {
    console.log(err);
  }

  // to be implemented later on
}

export default new PortfolioStore();
