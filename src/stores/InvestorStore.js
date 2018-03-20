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
    depositedAmount: 0,
    depositUsdEquiv: 0,
    managementFee: 0,
    sharePriceAtEntryDate: 0,
    purchasedShares: 0,
  }

  @observable
  depositedCurrency = {};

  @observable
  baseCurrencies = [];

  @observable
  selectedBaseCurrency = null;

  constructor() {
    requester.Market.getCurrencies()
      .then(this.onGetBaseCurrencies)
      .catch(this.onError);
  }

  @computed
  get depositUsdEquiv() {
    if (this.selectedBaseCurrency) {
      return this.values.depositedAmount * this.selectedBaseCurrency.Last;
    }
  }

  @computed
  get sharePriceAtEntryDate() {
    if (this.selectedBaseCurrency) {
      return this.selectedBaseCurrency.BaseVolume;
    }
  }

  @computed
  get purchasedShares() {
    // console.log((this.depositedAmount > 0))
    if (this.selectedBaseCurrency) {
      return this.selectedBaseCurrency.BaseVolume - this.values.depositedAmount;
    }
  }

  @action
  setFounder() {
    this.values.founder = !this.values.founder;
  }

  @action
  selectBaseCurrency(index) {
    this.selectedBaseCurrency = this.baseCurrencies[index];
    console.log(this.selectedBaseCurrency);
  }

  @action
  setInvestorValues(propertyType, newValue) {
    // all properties are send as string !!!
    this.values[propertyType] = newValue;

    console.log('store >>> setInvestorValues', this.values[propertyType], newValue);
    console.log('store >>> setInvestorValues', this.values);
  }

  @action
  createNewInvestor(id) {
    const newInvestor = {
      portfolioId: id,
      isFounder: this.values.founder,
      fullName: this.values.fullName,
      email: this.values.email,
      telephone: this.values.telephone,
      dateOfEntry: this.values.dateOfEntry,
      managementFee: this.values.managementFee,
      purchasedShares: this.values.purchasedShares,
    };

    requester.Investor.add(newInvestor)
      .then((result) => {
        // TODO: Something with result
        console.log(result);
      })
      .catch(this.onError);
  }

  @action.bound
  reset() {
    console.log(this.values);
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

    this.selectedBaseCurrency = null;
  }

  @action.bound
  onGetBaseCurrencies(result) {
    this.baseCurrencies = result.data;
  }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  onError(err) {
    console.log(err);
  }
  // to be implemented later on
}

export default new InvestorStore();
