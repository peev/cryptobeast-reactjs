import { observable, action, computed } from 'mobx';
import requester from '../services/requester';
import PortfolioStore from './PortfolioStore';

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
  editedValues = {
    fullName: '',
    email: '',
    telephone: '',
    managementFee: '',
  }

  @observable
  depositedCurrency;

  @observable
  baseCurrencies;

  @observable
  selectedBaseCurrency;

  @observable
  disabledSaveButton;

  @observable
  areFieldsEmpty;

  @observable
  selectedInvestor;

  @observable
  selectedInvestors;

  @observable
  selectedInvestorId;

  constructor() {
    this.depositedCurrency = {};
    this.baseCurrencies = [];
    this.selectedBaseCurrency = null;
    this.disabledSaveButton = true;
    this.areFieldsEmpty = true;
    this.selectedInvestor = null;
    this.selectedInvestors = [];


    requester.Market.getCurrencies()
      .then(this.onGetBaseCurrencies)
      .catch(this.onError);

    // on reload makes calls !!!
    // requester.Market.getSummaries()
    //   .then(this.onGetSummaries)
    //   .catch(this.onError);
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
  }

  @action
  setInvestorValues(propertyType, newValue) {
    if (propertyType === 'managementFee' && (newValue < 0 || newValue > 100)) {
      console.log('handleRequests --- managementFee');
      return;
    }
    // all properties are send as string !!!
    this.values[propertyType] = newValue;
  }

  @action
  getCurrentInvestor() {
    return this.selectedInvestor;
  }

  @action
  editInvestorValues(propertyType, newValue) {
    // all properties are send as string !!!
    this.editedValues[propertyType] = newValue;
  }

  @action
  selectInvestor(id, index) {
    this.selectedInvestorId = id;

    // selects the marked investor
    this.selectedInvestors.find((element) => {
      if (element.id === id) {
        this.selectedInvestor = { ...element };
      }
    });

    if (this.selectedInvestor) {
      // sets the editing values for the current investor
      this.editedValues.fullName = this.selectedInvestor.fullName;
      this.editedValues.email = this.selectedInvestor.email;
      this.editedValues.telephone = this.selectedInvestor.telephone;
      this.editedValues.managementFee = this.selectedInvestor.managementFee;
    }
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

  @action
  updateCurrentInvestor(investorId) {
    const updatedValues = this.editedValues;
    const finalResult = {};


    // eslint-disable-next-line no-restricted-syntax
    for (const key in updatedValues) {
      if (updatedValues.hasOwnProperty(key) && (updatedValues[key] !== '')) {
        finalResult[key] = updatedValues[key];
      }
    }

    console.log(finalResult);
    requester.Investor.update(investorId, finalResult)
      .then((result) => {
        // TODO: Something with result
        console.log(result);
        this.selectedInvestor.fullName = this.editedValues.fullName;
        this.selectedInvestor.email = this.editedValues.email;
        this.selectedInvestor.telephone = this.editedValues.telephone;
        this.selectedInvestor.managementFee = this.editedValues.managementFee;
        console.log(this.selectedInvestor);
      })
      .catch(this.onError);
  }

  @computed
  get handleEmptyFields() {
    const currentInvestor = this.values;
    const arrayOfValues = Object.values(currentInvestor);
    const arrayOfKeys = Object.keys(currentInvestor);

    console.log(currentInvestor);
    console.log(arrayOfValues);
    console.log(arrayOfKeys);

    // filters all the input values and returns only empty once,
    // skips only telephone (i !== 3), it is not required
    const filteredArray = arrayOfValues.filter((value, i) => value === '' && i !== 3);

    if (filteredArray.length === 0) {
      this.areFieldsEmpty = false;
      this.disabledSaveButton = false;
    }
  }

  @action
  getPortfolio() {
    PortfolioStore.currentPortfolio()
      .then(action((portfolio) => {
        if (portfolio) {
          this.selectedPortfolioId = portfolio.id;
          this.selectedInvestors = portfolio.investors;
        }
      }))
  }

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
  resetEdit() {
    console.log(this.values);
    this.editedValues.fullName = '';
    this.editedValues.email = '';
    this.editedValues.telephone = '';
    this.editedValues.managementFee = '';
  }

  @action.bound
  onGetBaseCurrencies(result) {
    this.baseCurrencies = result.data;
  }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  onGetSummaries() { }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  onError(err) {
    console.log(err);
  }
  // to be implemented later on
}

export default new InvestorStore();
