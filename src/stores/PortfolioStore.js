import { observable, action, computed } from 'mobx';
import requester from '../services/requester';

class PortfolioStore {
  @observable
  selectedPortfolio = null;

  @observable
  portfolios = null;

  @action
  getAllPortfolios() {
    // get from api
    requester.Portfolios.getAllPortfolios()
      .then((result) => {
        console.log('getAllPortfolios', result.data);

        this.portfolios = { ...result.data };
      })
      .catch((error) => {
        console.log(error);
      });
  }

  @action
  createPortfolio(portfolioName) {
    // send to api
    requester.Portfolios.createPortfolio(portfolioName)
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
