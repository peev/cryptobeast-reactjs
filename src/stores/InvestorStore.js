import { observable, action, computed } from 'mobx';
import requester from '../services/requester';

class InvestorStore {
  @observable
  values = {
    founder: false,
    fullName: '',
    email: '',
    telephone: '',
    dateOfEntry: '',
    depositedCurrency: '',
    depositedAmount: 0,
    depositUsdEquiv: 0,
    managementFee: 0,
    sharePriceAtEntryDate: 0,
    purchasedShares: 0,
  }

  @computed
  getLength() {
    return Object.keys(this.portfolios).length;
  }


  @action.bound
  onPortfoliosLoaded(result) {
    this.portfolios = { ...result.data };
    this.arePortfoliosLoaded = true;
  }

  @action
  setTelephone(telephone) {
    this.values.telephone = telephone;
  }

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

  @action.bound
  onError(err) {
    console.log(err);
  }

  // to be implemented later on
}

export default new InvestorStore();
