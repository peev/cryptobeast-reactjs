import { observable, action, computed } from 'mobx';
import requester from '../services/requester';
import PortfolioStore from './PortfolioStore';
import MarketStore from './MarketStore';

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
  newDepositValues = {
    amount: '',
    transactionDate: '',
    sharePriceAtEntryDate: '',
    purchasedShares: '',
  }

  @observable
  withdrawalValues = {
    amount: '',
    transactionDate: '',
    sharePriceAtEntryDate: '',
    inUSD: '',
    purchasedShares: 0,
    managementFee: '',
  }

  @observable
  individualSummaryValues = {
    sharesHeld: '',
    weightedEntryPrice: '',
    usdEquivalent: '',
    btcEquivalent: '',
    ethEquivalent: '',
    investmentPeriod: '',
    profit: '',
    feePotential: '',
  }

  @observable selectedBaseCurrency;
  @observable areFieldsEmpty;
  @observable selectedInvestor;
  @observable selectedInvestors;
  @observable selectedInvestorId;
  @observable investorError;
  @observable investorErrorDisplayed;

  constructor() {
    this.selectedBaseCurrency = null;
    this.areFieldsEmpty = true;
    this.selectedInvestor = null;
    this.selectedInvestors = [];
    this.selectedInvestorId = null;
    this.investorError = [];
    this.investorErrorDisplayed = false;
  }

  @action.bound
  depositUsdEquiv() {
    const baseCurrency = MarketStore.selectedBaseCurrency;
    const currentAmount = this.values.depositedAmount || this.newDepositValues.amount;
    if (baseCurrency && currentAmount) {
      let calculatedDepositUsdEquiv;
      switch (baseCurrency.pair) {
        case 'JPY':
        case 'EUR':
        case 'USD':
          calculatedDepositUsdEquiv = (currentAmount / baseCurrency.last) * MarketStore.baseCurrencyInUSD.last;
          break;
        case 'ETH':
          calculatedDepositUsdEquiv = currentAmount * baseCurrency.last * MarketStore.baseCurrencyInUSD.last;
          break;
        case 'BTC':
          calculatedDepositUsdEquiv = currentAmount * MarketStore.baseCurrencyInUSD.last;
          break;
        default:
          console.log('The is no such currency');
          break;
      }
      this.values.depositUsdEquiv = calculatedDepositUsdEquiv;
      return calculatedDepositUsdEquiv;
    }

    return null;
  }

  // #region Computed Values
  // #region Add Investor
  @computed
  get purchasedShares() {
    const baseCurrency = MarketStore.selectedBaseCurrency;
    const { currentPortfolioSharePrice } = PortfolioStore;
    if (baseCurrency && (this.values.depositedAmount || this.newDepositValues.amount)) {
      // TODO: To add Assets value below
      const calculatedPurchasedShares = (this.values.depositUsdEquiv / currentPortfolioSharePrice).toFixed(2);
      this.values.purchasedShares = calculatedPurchasedShares;
      return calculatedPurchasedShares;
    }

    return null;
  }

  @computed
  get depositSharePriceAtEntryDate() {
    const baseCurrency = MarketStore.selectedBaseCurrency;
    if (baseCurrency && this.newDepositValues.amount) {
      // TODO: To add Assets value below
      const calculatedPurchasedShares = baseCurrency.last * this.newDepositValues.amount;
      this.newDepositValues.sharePriceAtEntryDate = calculatedPurchasedShares;
      return calculatedPurchasedShares;
    }

    return null;
  }
  // #endregion

  @computed
  get depositPurchasedShares() {
    const baseCurrency = MarketStore.selectedBaseCurrency;
    const { currentPortfolioSharePrice } = PortfolioStore;
    if (baseCurrency && this.newDepositValues.amount) {
      // TODO: To add Assets value below
      // const calculatedPurchasedShares = 1 / this.newDepositValues.amount;
      const calculatedPurchasedShares = (this.values.depositUsdEquiv / currentPortfolioSharePrice).toFixed(2);
      this.newDepositValues.purchasedShares = calculatedPurchasedShares;

      return calculatedPurchasedShares;
    }

    return null;
  }

  @computed
  get withdrawInUSD() {
    if (this.selectedInvestor && this.withdrawalValues.amount) {
      const calculatedWithdrawInUSD = this.selectedInvestor.managementFee;
      this.withdrawalValues.inUSD = calculatedWithdrawInUSD;
      return calculatedWithdrawInUSD;
    }

    return null;
  }

  @computed
  get withdrawSharePriceAtEntryDate() {
    if (this.selectedInvestor && this.withdrawalValues.amount) {
      const calculatedWithdrawSharePriceAtEntryDate = PortfolioStore.currentPortfolioSharePrice;
      this.withdrawalValues.sharePriceAtEntryDate = calculatedWithdrawSharePriceAtEntryDate;
      return calculatedWithdrawSharePriceAtEntryDate;
    }

    return null;
  }

  @computed
  get withdrawPurchasedShares() {
    const baseCurrency = MarketStore.selectedBaseCurrency;
    const { currentPortfolioSharePrice } = PortfolioStore;

    if (this.selectedInvestor && this.withdrawalValues.amount) {
      // const calculatedWithdrawPurchasedShares = (this.withdrawalValues.amount / 1.75).toFixed(2);
      const calculatedWithdrawPurchasedShares = (this.withdrawalValues.amount / currentPortfolioSharePrice).toFixed(2);
      this.withdrawalValues.purchasedShares = calculatedWithdrawPurchasedShares;
      return calculatedWithdrawPurchasedShares;
    }

    return null;
  }

  @computed
  get depositManagementFee() {
    if (this.selectedInvestor && this.withdrawalValues.amount) {
      const calculatedDepositManagementFee = this.selectedInvestor.managementFee;
      this.withdrawalValues.managementFee = calculatedDepositManagementFee;
      return calculatedDepositManagementFee;
    }

    return null;
  }

  @computed
  get handleEmptyFields() {
    const currentInvestor = this.values;
    const arrayOfValues = Object.values(currentInvestor);
    // filters all the input values and returns only empty once,
    // skips telephone (i !== 3), it is not required
    // skips sharePrice (i !== 8), it calculated by default
    const filteredArray = arrayOfValues.filter((value, i) => value === '' && i !== 3 && i !== 8);

    if (filteredArray.length === 0) {
      this.areFieldsEmpty = false;
    }

    return null;
  }

  // #region Investor Individual Summary
  @computed
  get individualSharesHeld() {
    if (this.selectedInvestor) {
      const calculatedIndividualSharesHeld = this.selectedInvestor.purchasedShares;
      this.individualSummaryValues.sharesHeld = calculatedIndividualSharesHeld;

      return calculatedIndividualSharesHeld;
    }

    return null;
  }

  @computed
  get individualWeightedEntryPrice() {
    if (this.selectedInvestor) {
      const calculatedIndividualWeightedEntryPrice = this.selectedInvestor.purchasedShares;
      this.individualSummaryValues.weightedEntryPrice = calculatedIndividualWeightedEntryPrice;

      return calculatedIndividualWeightedEntryPrice;
    }

    return null;
  }

  @computed
  get individualUSDEquivalent() {
    if (this.selectedInvestor) {
      //  TODO: add real share price from PortfolioStore
      const calculatedIndividualUSDEquivalent = this.selectedInvestor.purchasedShares * 1;
      this.individualSummaryValues.usdEquivalent = calculatedIndividualUSDEquivalent;
      // this.individualSummaryValues.feePotential = calculatedIndividualUSDEquivalent * this.selectedInvestor.managementFee;

      return calculatedIndividualUSDEquivalent;
    }

    return null;
  }

  @computed
  get individualBTCEquivalent() {
    if (this.selectedInvestor) {
      //  TODO: add real share price from PortfolioStore
      const calculatedIndividualBTCEquivalent = (this.selectedInvestor.purchasedShares / MarketStore.baseCurrencies[4].last).toFixed(2);
      this.individualSummaryValues.btcEquivalent = calculatedIndividualBTCEquivalent;

      return calculatedIndividualBTCEquivalent;
    }

    return null;
  }

  @computed
  get individualETHEquivalent() {
    if (this.selectedInvestor && MarketStore.baseCurrencies) {
      //  TODO: add real share price from PortfolioStore
      const calculatedIndividualETHEquivalent = (this.selectedInvestor.purchasedShares / MarketStore.baseCurrencies[3].last).toFixed(2);
      this.individualSummaryValues.ethEquivalent = calculatedIndividualETHEquivalent;

      return calculatedIndividualETHEquivalent;
    }

    return null;
  }

  @computed
  get individualInvestmentPeriod() {
    if (this.selectedInvestor) {
      // Get 1 day in milliseconds
      const oneDay = 1000 * 60 * 60 * 24;
      const currentDate = new Date();
      const dateOfEntryConverted = new Date(this.selectedInvestor.dateOfEntry);

      const calculatedIndividualInvestmentPeriod = Math.round((currentDate - dateOfEntryConverted) / oneDay);
      this.individualSummaryValues.investmentPeriod = calculatedIndividualInvestmentPeriod;

      return calculatedIndividualInvestmentPeriod;
    }

    return null;
  }

  @computed
  get individualProfit() {
    if (this.selectedInvestor) {
      const calculatedIndividualProfit = 1;
      // (current share price - weighted entry price) / weighted entry price*
      this.individualSummaryValues.profit = calculatedIndividualProfit;

      return calculatedIndividualProfit;
    }

    return null;
  }

  @computed
  get individualFeePotential() {
    if (this.selectedInvestor) {
      // TODO: USD is hard coded
      const calculatedIndividualFeePotential = ((MarketStore.baseCurrencies[3].last * this.selectedInvestor.managementFee) / 100).toFixed(2);
      this.individualSummaryValues.feePotential = calculatedIndividualFeePotential;

      return calculatedIndividualFeePotential;
    }

    return null;
  }

  // #endregion

  // #endregion

  @action
  handleDepositEmptyFields() {
    const currentDeposit = this.newDepositValues;

    // const arrayOfValues = Object.values(currentDeposit);
    // console.log(arrayOfValues)
    // const filteredArray = arrayOfValues.filter((value, i) => value === '' && (i !== 2 || i !== 3));
    // console.log(filteredArray)

    // if (filteredArray.length === 0) {
    //   this.areFieldsEmpty = false;
    // }
    // const currentInvestor = this.values;

    const baseCurrency = MarketStore.selectedBaseCurrency;
    if (baseCurrency === null) {
      this.investorError.push('Please select currency');
    }

    // Checks the currently entered values. If value is empty and it is required,
    // than adds a error massage to the array of errors
    Object.keys(currentDeposit).forEach((prop) => {
      if (currentDeposit[prop] === '' && prop === 'transactionDate') {
        this.investorError.push('Entry date is required.');
      }
      if (currentDeposit[prop] === '' && prop === 'amount') {
        this.investorError.push('Amount is required.');
      }
    });
  }

  @action
  setIsFounder() {
    this.values.isFounder = !this.values.isFounder;
  }

  @action
  getCurrentInvestor() {
    return this.selectedInvestor;
  }

  @computed
  get getAllCurrentInvestors() {
    return this.selectedInvestors;
  }

  @action
  setNewInvestorValues(propertyType, newValue) {
    const fieldsChecked = this.fieldValidations(propertyType, newValue);

    if (fieldsChecked) {
      // all properties are send as string !!!
      this.values[propertyType] = newValue;
    }
  }

  @action
  setInvestorEditingValues(propertyType, newValue) {
    const fieldsChecked = this.fieldValidations(propertyType, newValue);

    if (fieldsChecked) {
      // all properties are send as string !!!
      this.editedValues[propertyType] = newValue;
    }
  }

  @action
  setNewDepositInvestorValues(propertyType, newValue) {
    const fieldsChecked = this.fieldValidations(propertyType, newValue);

    if (fieldsChecked) {
      // all properties are send as string !!!
      this.newDepositValues[propertyType] = newValue;
    }
  }

  @action
  setWithdrawInvestorValues(propertyType, newValue) {
    const fieldsChecked = this.fieldValidations(propertyType, newValue);

    if (fieldsChecked) {
      // all properties are send as string !!!
      this.withdrawalValues[propertyType] = newValue;
    }
  }

  @action
  selectInvestor(id, index) {
    this.selectedInvestorId = id;

    // selects the marked investor
    this.getAllCurrentInvestors.find((element) => {
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
      currency: MarketStore.selectedBaseCurrency.pair,
      balance: +this.values.depositedAmount,
      portfolioId: id,
      investor: {
        isFounder: this.values.isFounder,
        fullName: this.values.fullName,
        email: this.values.email,
        telephone: this.values.telephone,
        dateOfEntry: this.values.dateOfEntry,
        managementFee: this.values.managementFee,
        purchasedShares: this.values.purchasedShares,
      },
      transaction: {
        investorName: this.values.fullName,
        dateOfEntry: (new Date()).toLocaleString(),
        transactionDate: this.values.dateOfEntry,
        amountInUSD: this.values.depositUsdEquiv,
        sharePrice: PortfolioStore.currentPortfolioSharePrice,
        shares: parseFloat(this.values.purchasedShares),
      },
    };
    requester.Investor.add(newInvestor)
      .then(action((result) => {
        // TODO: Something with result
        PortfolioStore.getPortfolios();
        console.log(result);
      }))
      .catch(this.onError);
  }

  @action
  createNewDepositInvestor(id) {
    const deposit = {
      currency: MarketStore.selectedBaseCurrency.pair,
      balance: +this.newDepositValues.amount,
      portfolioId: PortfolioStore.selectedPortfolioId,
      investorId: id,
      transaction: {
        investorName: this.selectedInvestor.fullName,
        dateOfEntry: (new Date()).toLocaleString(),
        transactionDate: this.newDepositValues.transactionDate,
        amountInUSD: this.values.depositUsdEquiv,
        sharePrice: PortfolioStore.currentPortfolioSharePrice,
        shares: parseFloat(this.newDepositValues.purchasedShares),
      },
    };

    requester.Investor.addDeposit(deposit)
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

    requester.Investor.update(investorId, finalResult)
      .then((result) => {
        // TODO: Something with result
        this.selectedInvestor.fullName = this.editedValues.fullName;
        this.selectedInvestor.email = this.editedValues.email;
        this.selectedInvestor.telephone = this.editedValues.telephone;
        this.selectedInvestor.managementFee = this.editedValues.managementFee;
      })
      .catch(this.onError);
  }

  @action
  withdrawalInvestor(id) {
    const hasEnoughShares = this.selectedInvestor.purchasedShares >= this.withdrawalValues.purchasedShares;

    if (!hasEnoughShares) {
      this.investorError.push('The investor has not enough shares!');
      return;
    }

    const withdrawal = {
      currency: 'USD',
      balance: parseFloat(this.withdrawalValues.amount) * (-1),
      portfolioId: PortfolioStore.selectedPortfolioId,
      investorId: id,
      transaction: {
        investorName: this.selectedInvestor.fullName,
        dateOfEntry: (new Date()).toLocaleString(),
        transactionDate: this.withdrawalValues.transactionDate,
        amountInUSD: this.withdrawalValues.amount,
        sharePrice: PortfolioStore.currentPortfolioSharePrice,
        shares: parseFloat(this.withdrawalValues.purchasedShares) * (-1),
      },
    }
    requester.Investor.withdrawal(withdrawal)
      .then((result) => {
        // TODO: Something with result
        console.log(result);
      })
      .catch(this.onError);
  }

  @action
  getPortfolio() {
    const currentSelectedPortfolio = PortfolioStore.getCurrentPortfolio();

    if (currentSelectedPortfolio) {
      this.selectedPortfolioId = currentSelectedPortfolio.id;
      this.selectedInvestors = currentSelectedPortfolio.investors;
    }
  }

  // VALIDATIONS
  @action.bound
  // eslint-disable-next-line class-methods-use-this
  fieldValidations(propertyType, newValue) {
    if (propertyType === 'depositedAmount' && (newValue < 0)) {
      return false;
    }
    if (propertyType === 'managementFee' && (newValue < 0 || newValue > 100)) {
      return false;
    }
    if (propertyType === 'amount' && (newValue < 0)) {
      return false;
    }

    return true;
  }

  @action
  // eslint-disable-next-line class-methods-use-this
  emailFieldValidation() {
    const currentEmail = this.values.email;
    const currentInvestors = this.getAllCurrentInvestors;
    let result = [];

    if (currentInvestors) {
      result = currentInvestors.filter(x => x.email === currentEmail);

      if (result.length > 0) {
        this.investorError.push('Email already exists');
        return false;
      }
    }

    return true;
  }

  @computed
  get getAddInvestorErrors() {
    return this.investorError;
  }

  @action
  handleNotSelectedPortfolio() {
    if (!this.selectedPortfolioId) {
      this.investorError.push('Please select portfolio first');
      return false;
    }
    return true;
  }

  @action
  handleAddInvestorErrors() {
    const currentInvestor = this.values;

    const baseCurrency = MarketStore.selectedBaseCurrency;
    if (baseCurrency === null) {
      this.investorError.push('Please select currency');
    }

    // Checks the currently entered values. If value is empty and it is required,
    // than adds a error massage to the array of errors
    Object.keys(currentInvestor).forEach((prop) => {
      if (currentInvestor[prop] === '' && prop === 'dateOfEntry') {
        this.investorError.push('Entry date is required.');
      }
      if (currentInvestor[prop] === '' && prop === 'depositedAmount') {
        this.investorError.push('Deposited amount is required.');
      }
      if (currentInvestor[prop] === '' && prop === 'email') {
        this.investorError.push('Email is required.');
      }
      if (currentInvestor[prop] === '' && prop === 'fullName') {
        this.investorError.push('Full name is required.');
      }
      if (currentInvestor[prop] === '' && prop === 'managementFee') {
        this.investorError.push('Management Fee is required.');
      }
    });
  }

  // RESETS
  @action
  resetErrors() {
    this.investorError = [];
  }

  @action
  reset() {
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
    console.log(this.values);
  }

  @action
  resetEdit() {
    this.editedValues.fullName = '';
    this.editedValues.email = '';
    this.editedValues.telephone = '';
    this.editedValues.managementFee = '';
    console.log(this.editedValues);
  }

  @action.bound
  resetDeposit() {
    this.newDepositValues.amount = '';
    this.newDepositValues.transactionDate = '';
    this.newDepositValues.sharePriceAtEntryDate = '';
    this.newDepositValues.purchasedShares = '';
    console.log(this.newDepositValues);
  }

  @action.bound
  resetWithdrawal() {
    this.withdrawalValues.amount = '';
    this.withdrawalValues.transactionDate = '';
    this.withdrawalValues.sharePriceAtEntryDate = '';
    this.withdrawalValues.inUSD = '';
    this.withdrawalValues.purchasedShares = 0;
    this.withdrawalValues.managementFee = '';
    console.log(this.withdrawalValues);
  }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  onGetSummaries() { }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  onError(err) {
    console.log(err);
  }
}

export default new InvestorStore();
