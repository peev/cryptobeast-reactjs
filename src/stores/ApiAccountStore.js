import { observable, action, computed } from 'mobx';
import requester from '../services/requester';
import PortfolioStore from './PortfolioStore';

class ApiAccountStore {
  @observable
  values = {
    apiServiceName: '',
    apiKey: '',
    apiSecret: '',
    isActive: true,
  }

  @observable
  editedValues = {
    apiServiceName: '',
    apiKey: '',
    apiSecret: '',
    isActive: true,
  }

  @observable
  selectedApiService = '';

  constructor() {
    this.apiServiceName = '';
    this.apiKey = '';
    this.apiSecret = '';
    this.isActive = true;
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
  setIsActive() {
    this.values.isActive = !this.values.isActive;
  }

  @action
  selectApiName(value) {
    this.values.apiServiceName = value;
  }

  @action
  getCurrentInvestor() {
    return this.selectedInvestor;
  }

  @action
  setNewApiAccountValues(propertyType, newValue) {
    // all properties are send as string !!!
    this.values[propertyType] = newValue;
    console.log('>>> values in api account store', this.values);
  }

  @action
  setInvestorEditingValues(propertyType, newValue) {
    if (propertyType === 'depositedAmount' && (newValue < 0)) {
      return;
    }
    if (propertyType === 'managementFee' && (newValue < 0 || newValue > 100)) {
      return;
    }

    // all properties are send as string !!!
    this.editedValues[propertyType] = newValue;
  }

  @action
  setNewDepositInvestorValues(propertyType, newValue) {
    if (propertyType === 'amount' && (newValue < 0)) {
      return;
    }

    // all properties are send as string !!!
    this.newDepositValues[propertyType] = newValue;
  }

  @action
  createNewAccount(id) {
    const newAccount = {
      apiServiceName: this.values.apiServiceName,
      apiKey: this.values.apiKey,
      apiSecret: this.values.apiSecret,
      isActive: this.values.isActive,
      portfolioId: id,
    };

    requester.ApiAccount.addAccount(newAccount)
      .then((result) => {
        // TODO: Something with result
      })
      .catch(this.onError);
  }

  @action
  createNewDepositInvestor(id) {
    const newDepositInvestor = {
      amount: this.newDepositValues.amount,
    };

    requester.Investor.addDeposit(id, newDepositInvestor)
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

  @action
  withdrawalInvestor(investorId) {
    const withdrawalValue = {
      amount: this.withdrawalValues.amount,
    };

    requester.Investor.withdrawal(investorId, withdrawalValue)
      .then((result) => {
        // TODO: Something with result
        console.log(result);
      })
      .catch(this.onError);
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
    this.values.isActive = false;
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
    console.log(this.editedValues);
    this.editedValues.fullName = '';
    this.editedValues.email = '';
    this.editedValues.telephone = '';
    this.editedValues.managementFee = '';
  }

  @action.bound
  resetDeposit() {
    console.log(this.newDepositValues);
    this.newDepositValues.amount = '';
    this.newDepositValues.transactionDate = '';
    this.newDepositValues.sharePriceAtEntryDate = '';
    this.newDepositValues.purchasedShares = '';
  }

  @action.bound
  resetWithdrawal() {
    console.log(this.withdrawalValues);
    this.withdrawalValues.amount = '';
    this.withdrawalValues.transactionDate = '';
    this.withdrawalValues.sharePriceAtEntryDate = '';
    this.withdrawalValues.inUSD = '';
    this.withdrawalValues.purchasedShares = 0;
    this.withdrawalValues.managementFee = '';
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

export default new ApiAccountStore();
