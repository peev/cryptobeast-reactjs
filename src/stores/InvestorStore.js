import { observable, action, computed } from 'mobx';
import requester from '../services/requester';

class InvestorStore {
  @observable
  values = {
    isFounder: false,
    fullName: '',
    email: '',
    telephone: '',
    dateOfEntry: '',
    depositedAmount: '',
    depositUsdEquiv: '',
    managementFee: '',
    sharePriceAtEntryDate: '',
    purchasedShares: '',
  }

  @observable
  depositedCurrency = {};

  @observable
  baseCurrencies = [];

  @observable
  selectedBaseCurrency = null;

  @observable
  disabledSaveButton = true;

  @observable
  areFieldsEmpty = true;

  constructor() {
    requester.Market.getCurrencies()
      .then(this.onGetBaseCurrencies)
      .catch(this.onError);
  }

  @computed
  get depositUsdEquiv() {
    if (this.selectedBaseCurrency) {
      const calculatedDepositUsdEquiv = this.values.depositedAmount * this.selectedBaseCurrency.Last;
      this.values.depositUsdEquiv = calculatedDepositUsdEquiv;
      return calculatedDepositUsdEquiv;
    }
  }

  @computed
  get sharePriceAtEntryDate() {
    if (this.selectedBaseCurrency) {
      const calculatedSharePriceAtEntryDate = this.selectedBaseCurrency.BaseVolume;
      this.values.sharePriceAtEntryDate = calculatedSharePriceAtEntryDate;
      return calculatedSharePriceAtEntryDate;
    }
  }

  @computed
  get purchasedShares() {
    // console.log((this.depositedAmount > 0))
    if (this.selectedBaseCurrency) {
      const calculatedPurchasedShares = this.selectedBaseCurrency.BaseVolume / this.values.depositedAmount;
      this.values.purchasedShares = calculatedPurchasedShares;
      return calculatedPurchasedShares;
    }
  }

  @action
  setIsFounder() {
    this.values.isFounder = !this.values.isFounder;
  }

  @action
  selectBaseCurrency(index) {
    this.selectedBaseCurrency = this.baseCurrencies[index];
    console.log(this.selectedBaseCurrency);
  }

  @action
  setInvestorValues(propertyType, newValue) {
    if (propertyType === 'managementFee' && (newValue < 0 || newValue > 100)) {
      console.log('handleRequests --- managementFee');
      return;
    }
    // all properties are send as string !!!
    this.values[propertyType] = newValue;

    console.log('store >>> setInvestorValues', this.values[propertyType], newValue);
    console.log('store >>> setInvestorValues', this.values);
  }

  @action
  createNewInvestor(id) {
    const newInvestor = {
      portfolioId: id,
      isFounder: this.values.isFounder,
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

  @computed
  get handleEmptyFields() {
    const currentInvestor = this.values;
    const arrayOfValues = Object.values(currentInvestor);
    const filteredArray = arrayOfValues.filter(value => value === '');

    if (filteredArray.length === 0) {
      this.areFieldsEmpty = false;
      this.disabledSaveButton = false;
    }
  }

  // @computed
  //  checkFields(obj) {

  // }

  @action.bound
  reset() {
    console.log(this.values);
    this.values.isFounder = false;
    this.values.fullName = '';
    this.values.email = '';
    this.values.telephone = '';
    this.values.dateOfEntry = '';
    this.values.depositedAmount = '';
    this.values.depositUsdEquiv = '';
    this.values.managementFee = '';
    this.values.sharePriceAtEntryDate = '';
    this.values.purchasedShares = '';

    this.selectedBaseCurrency = null;
    this.areFieldsEmpty = true;
    this.disabledSaveButton = true;
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
