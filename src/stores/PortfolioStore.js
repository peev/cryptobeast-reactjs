import { observable, action, computed } from 'mobx';
import requester from '../services/requester';

class PortfolioStore {
  @observable
  selectedPortfolio = null;

  @observable
  portfolios = null;

  @observable
  arePortfoliosLoaded = false;

  @action
  getAllPortfolios() {
    if (!this.arePortfoliosLoaded) {
      // get from api
      requester.Portfolios.getAll()
        .then((result) => {
          console.log('getAllPortfolios', result.data);

          this.portfolios = { ...result.data };
        })
        .catch((error) => {
          console.log(error);
        });
    }

    this.arePortfoliosLoaded = true;
  }

  @action
  createPortfolio(portfolioName) {
    // send to api
    requester.Portfolios.create(portfolioName)
      .then((result) => {
        console.log('createPortfolio', result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // to be implemented later on
}

export default new PortfolioStore();
