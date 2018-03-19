import { observable, action } from 'mobx';
import requester from '../services/requester';

class InvestorStore {
  @observable
  values = {
    founder: false,
    fullName: '',
    email: '',
    telephone: '',
    dateOfEntry: '',
    depositedAmount: 0,
    depositUsdEquiv: 0,
    managementFee: 0,
    sharePriceAtEntryDate: 0,
    purchasedShares: 0,
  }

  @observable
  depositedCurrency = [];

  constructor() {
    requester.Market.getCurrencies()
      .then(this.onGetBaseCurrencies)
      .catch(this.onError);
  }

  @action
  setFounder() {
    this.values.founder = !this.values.founder;
  }

  @action.bound
  setInvestorValues(propertyType, newValue) {
    switch (this.values[propertyType]) {
      case 'depositedAmount':
        this.values[propertyType] = parseInt(newValue, 10);
        break;
      case 'depositUsdEquiv':
        this.values[propertyType] = parseInt(newValue, 10);
        break;
      case 'managementFee':
        this.values[propertyType] = parseInt(newValue, 10);
        break;
      case 'sharePriceAtEntryDate':
        this.values[propertyType] = parseInt(newValue, 10);
        break;
      case 'purchasedShares':
        this.values[propertyType] = parseInt(newValue, 10);
        break;
      default:
        // this.values[propertyType] = newValue;
        break;
    }
    this.values[propertyType] = newValue;

    console.log('store----', this.values[propertyType], newValue);
    console.log('store----', this.values);
  }

  @action.bound
  onGetBaseCurrencies(result) {
    this.depositedCurrency = [...result.data];
  }

  @action.bound
  createNewInvestor() {
    const currentDate = Date.now();

    const newInvestor = {
      isFounder: this.values.founder,
      fullName: this.values.fullName,
      email: this.values.email,
      telephone: this.values.telephone,
      // dateOfEntry: this.values.dateOfEntry,
      dateOfEntry: currentDate, // FIXME: for testing
      managementFee: this.values.managementFee,
      purchasedShares: this.values.purchasedShares,
    };

    requester.Investor.create(newInvestor)
      .then((result) => {
        console.log(result);
      })
      .catch(this.onError);
  }

  @action.bound
  reset() {
    this.values.founder = false;
    this.values.fullName = '';
    this.values.email = '';
    this.values.telephone = '';
    this.values.dateOfEntry = '';
    this.values.depositedAmount = 0;
    this.values.depositUsdEquiv = 0;
    this.values.managementFee = 0;
    this.values.sharePriceAtEntryDate = 0;
    this.values.purchasedShares = 0;
  }

  @action.bound
  onError(err) {
    console.log(err);
  }
  // to be implemented later on
}

export default new InvestorStore();
