import {
  observable,
  action,
  computed,
} from 'mobx';
import requester from '../services/requester';
import PortfolioStore from './PortfolioStore';
import MarketStore from './MarketStore';
import NotificationStore from './NotificationStore';

class InvestorStore {
  @observable newInvestorValues
  @observable updateInvestorValues;
  @observable newDepositValues;
  @observable withdrawalValues;
  @observable individualSummaryValues;
  @observable selectedInvestor;
  @observable selectedInvestorId;

  constructor() {
    // #region Initialize Values
    this.newInvestorValues = {
      isFounder: false,
      fullName: '',
      email: '',
      telephone: '',
      dateOfEntry: '',
      depositedAmount: '',
      // depositUsdEquiv: '',
      managementFee: '',
      sharePriceAtEntryDate: '',
      purchasedShares: '',
    };
    this.updateInvestorValues = {
      fullName: '',
      email: '',
      telephone: '',
      managementFee: '',
    };
    this.newDepositValues = {
      amount: '',
      transactionDate: '',
      sharePriceAtEntryDate: '',
      purchasedShares: '',
    };
    this.withdrawalValues = {
      amount: '',
      transactionDate: '',
      sharePriceAtEntryDate: '',
      inUSD: '',
      purchasedShares: 0,
      managementFee: '',
    };
    this.individualSummaryValues = {
      sharesHeld: '',
      weightedEntryPrice: '',
      usdEquivalent: '',
      btcEquivalent: '',
      ethEquivalent: '',
      investmentPeriod: '',
      profit: '',
      feePotential: '',
    };

    this.selectedInvestor = null;
    this.selectedInvestorId = null;
    // #endregion
  }

  // ======= Computed =======
  // #region Computed
  // #region Add Investor
  @computed
  get purchasedShares() {
    const baseCurrency = MarketStore.selectedBaseCurrency;
    const {
      currentPortfolioSharePrice,
    } = PortfolioStore;
    if (baseCurrency && (this.newInvestorValues.depositedAmount || this.newDepositValues.amount)) {
      // TODO: To add Assets value below
      const calculatedPurchasedShares = (this.depositUsdEquiv / (currentPortfolioSharePrice || 1)).toFixed(2);
      this.newInvestorValues.purchasedShares = calculatedPurchasedShares;
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

  // #region Deposit Investor
  @computed
  get depositPurchasedShares() {
    const baseCurrency = MarketStore.selectedBaseCurrency;
    const {
      currentPortfolioSharePrice,
    } = PortfolioStore;
    if (baseCurrency && this.newDepositValues.amount) {
      // TODO: To add Assets value below
      // const calculatedPurchasedShares = 1 / this.newDepositValues.amount;
      const calculatedPurchasedShares = (this.depositUsdEquiv / currentPortfolioSharePrice).toFixed(2);
      this.newDepositValues.purchasedShares = calculatedPurchasedShares;

      return calculatedPurchasedShares;
    }

    return null;
  }
  // #endregion

  // #region Withdraw Investor
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
    const {
      currentPortfolioSharePrice,
    } = PortfolioStore;

    if (this.selectedInvestor && this.withdrawalValues.amount) {
      // const calculatedWithdrawPurchasedShares = (this.withdrawalValues.amount / 1.75).toFixed(2);
      const calculatedWithdrawPurchasedShares = (this.withdrawalValues.amount / currentPortfolioSharePrice).toFixed(2);
      this.withdrawalValues.purchasedShares = calculatedWithdrawPurchasedShares;
      return calculatedWithdrawPurchasedShares;
    }

    return null;
  }

  @computed
  get withdrawManagementFee() {
    if (this.selectedInvestor && this.withdrawalValues.amount) {
      const calculatedWithdrawManagementFee = this.selectedInvestor.managementFee;
      this.withdrawalValues.managementFee = calculatedWithdrawManagementFee;
      return calculatedWithdrawManagementFee;
    }

    return null;
  }
  // #endregion

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

  // ======= Action =======
  // Investor Set Values -> Founder, New, Update, Deposit, Withdraw
  // #region Investor Set Values
  @action
  setIsFounder() {
    this.newInvestorValues.isFounder = !this.newInvestorValues.isFounder;
  }

  @action
  setNewInvestorValues(propertyType, newValue) {
    const fieldsChecked = this.handleFieldValidations(propertyType, newValue);

    if (fieldsChecked) {
      // all properties are send as string !!!
      this.newInvestorValues[propertyType] = newValue;
    }
  }

  @action
  setInvestorUpdateValues(propertyType, newValue) {
    const fieldsChecked = this.handleFieldValidations(propertyType, newValue);

    if (fieldsChecked) {
      // all properties are send as string !!!
      this.updateInvestorValues[propertyType] = newValue;
    }
  }

  @action
  setNewDepositInvestorValues(propertyType, newValue) {
    const fieldsChecked = this.handleFieldValidations(propertyType, newValue);

    if (fieldsChecked) {
      // all properties are send as string !!!
      this.newDepositValues[propertyType] = newValue;
    }
  }

  @action
  setWithdrawInvestorValues(propertyType, newValue) {
    const fieldsChecked = this.handleFieldValidations(propertyType, newValue);

    if (fieldsChecked) {
      // all properties are send as string !!!
      this.withdrawalValues[propertyType] = newValue;
    }
  }
  // #endregion

  // Investor -> New, Update, Deposit, Withdraw
  // #region Investor
  @action
  createNewInvestor(id) {
    const newInvestor = {
      currency: MarketStore.selectedBaseCurrency.pair,
      balance: +this.newInvestorValues.depositedAmount,
      portfolioId: id,
      investor: {
        isFounder: this.newInvestorValues.isFounder,
        fullName: this.newInvestorValues.fullName,
        email: this.newInvestorValues.email,
        telephone: this.newInvestorValues.telephone,
        dateOfEntry: this.newInvestorValues.dateOfEntry,
        managementFee: this.newInvestorValues.managementFee,
        purchasedShares: this.newInvestorValues.purchasedShares,
        portfolioId: id,
      },
      transaction: {
        investorName: this.newInvestorValues.fullName,
        dateOfEntry: (new Date()).toLocaleString(),
        transactionDate: this.newInvestorValues.dateOfEntry,
        amountInUSD: this.depositUsdEquiv,
        sharePrice: PortfolioStore.currentPortfolioSharePrice,
        shares: parseFloat(this.newInvestorValues.purchasedShares),
        portfolioId: id,
      },
    };
    requester.Investor.add(newInvestor)
      .then(action((result) => {
        PortfolioStore.currentPortfolioTransactions.push(result.data);
      }))
      .catch(err => console.log(err));
  }

  @action
  updateCurrentInvestor(investorId) {
    const updatedValues = this.updateInvestorValues;
    const finalResult = {};


    // eslint-disable-next-line no-restricted-syntax
    for (const key in updatedValues) {
      if (updatedValues.hasOwnProperty(key) && (updatedValues[key] !== '')) {
        finalResult[key] = updatedValues[key];
      }
    }

    requester.Investor.update(investorId, finalResult)
      .then(action((result) => {
        const portfolioInvestors = PortfolioStore.currentPortfolioInvestors;
        // console.log(PortfolioStore.currentPortfolioInvestors, finalResult, investorId)
        portfolioInvestors.forEach((investor) => {
          if (investor.id === investorId) {
            // eslint-disable-next-line no-restricted-syntax
            for (const key in investor) {
              if (investor.hasOwnProperty(key) && finalResult.hasOwnProperty(key)) {
                investor[key] = finalResult[key];
              }
            }
          }
        });
      }))
      .catch(err => console.log(err));
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
        amountInUSD: this.depositUsdEquiv,
        sharePrice: PortfolioStore.currentPortfolioSharePrice,
        shares: parseFloat(this.newDepositValues.purchasedShares),
        portfolioId: PortfolioStore.selectedPortfolioId,
        investorId: id,
      },
    };

    requester.Investor.addDeposit(deposit)
      .then(action((result) => {
        PortfolioStore.currentPortfolioTransactions.push(result.data);
      }))
      .catch(err => console.log(err));
  }

  @action
  withdrawalInvestor(id) {
    const withdrawal = {
      currency: 'USD',
      balance: +this.withdrawalValues.amount,
      portfolioId: PortfolioStore.selectedPortfolioId,
      investorId: id,
      transaction: {
        investorName: this.selectedInvestor.fullName,
        dateOfEntry: (new Date()).toLocaleString(),
        transactionDate: this.withdrawalValues.transactionDate,
        amountInUSD: this.withdrawalValues.amount,
        sharePrice: PortfolioStore.currentPortfolioSharePrice,
        shares: parseFloat(this.withdrawalValues.purchasedShares),
        portfolioId: PortfolioStore.selectedPortfolioId,
        investorId: id,
      },
    };

    requester.Investor.withdrawal(withdrawal)
      .then(action((result) => {
        PortfolioStore.currentPortfolioTransactions.push(result.data);
      }))
      .catch(err => console.log(err));
  }


  // #endregion

  // Validations
  // #region Validations
  @action
  handleAddInvestorErrors() {
    const currentInvestor = this.newInvestorValues;
    let noErrors = true;
    const baseCurrency = MarketStore.selectedBaseCurrency;

    // Checks if portfolio is selected
    noErrors = this.handleIsPortfolioSelected();

    // Checks if base currency is added
    if (baseCurrency === null) {
      NotificationStore.addMessage('errorMessages', 'Please select currency');
      noErrors = false;
    }

    // Checks if email is valid - duplication only
    noErrors = this.handleEmailValidation();

    // Checks the currently entered values. If value is empty and it is required,
    // than adds a error massage to the array of errors
    Object.keys(currentInvestor).forEach((prop) => {
      if (currentInvestor[prop] === '' && prop === 'dateOfEntry') {
        NotificationStore.addMessage('errorMessages', 'Entry date is required.');
        noErrors = false;
      }
      if (currentInvestor[prop] === '' && prop === 'depositedAmount') {
        NotificationStore.addMessage('errorMessages', 'Deposited amount is required.');
        noErrors = false;
      }
      if (currentInvestor[prop] === '' && prop === 'email') {
        NotificationStore.addMessage('errorMessages', 'Email is required.');
        noErrors = false;
      }
      if (currentInvestor[prop] === '' && prop === 'fullName') {
        NotificationStore.addMessage('errorMessages', 'Full name is required.');
        noErrors = false;
      }
      if (currentInvestor[prop] === '' && prop === 'managementFee') {
        NotificationStore.addMessage('errorMessages', 'Management Fee is required.');
        noErrors = false;
      }
    });

    return noErrors;
  }

  @action
  handleDepositInvestorErrors() {
    const currentDeposit = this.newDepositValues;
    const baseCurrency = MarketStore.selectedBaseCurrency;
    let noErrors = true;

    // Checks if portfolio is selected
    noErrors = this.handleIsPortfolioSelected();

    // Checks if Investor is selected
    if (this.selectedInvestor === null) {
      NotificationStore.addMessage('errorMessages', 'Please select Investor');
      noErrors = false;
    }

    // Checks if base currency is added
    if (baseCurrency === null) {
      NotificationStore.addMessage('errorMessages', 'Please select currency');
      noErrors = false;
    }

    // Checks the currently entered values. If value is empty and it is required,
    // than adds a error massage to the array of errors
    Object.keys(currentDeposit).forEach((prop) => {
      if (currentDeposit[prop] === '' && prop === 'transactionDate') {
        NotificationStore.addMessage('errorMessages', 'Entry date is required.');
        noErrors = false;
      }
      if (currentDeposit[prop] === '' && prop === 'amount') {
        NotificationStore.addMessage('errorMessages', 'Amount is required.');
        noErrors = false;
      }
    });

    return noErrors;
  }

  @action
  handleWithdrawalInvestorErrors() {
    let noErrors = true;

    // Checks if Investor is selected
    if (this.selectedInvestor === null) {
      NotificationStore.addMessage('errorMessages', 'Please select Investor');
      noErrors = false;
    }

    // Checks if amount is entered
    if (this.withdrawalValues.amount === '') {
      NotificationStore.addMessage('errorMessages', 'Withdrawal amount is required.');
      noErrors = false;
    }

    // Checks if date is entered
    if (this.withdrawalValues.transactionDate === '') {
      NotificationStore.addMessage('errorMessages', 'Withdrawal date is required.');
      noErrors = false;
    }

    const hasInputShares = this.selectedInvestor !== null ? this.selectedInvestor.purchasedShares : 0;
    const hasEnoughShares = hasInputShares >= this.withdrawalValues.purchasedShares;
    if (!hasEnoughShares) {
      NotificationStore.addMessage('errorMessages', 'The investor has not enough shares!');
      noErrors = false;
    }

    return noErrors;
  }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  handleFieldValidations(propertyType, newValue) {
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
  handleEmailValidation() {
    const currentEmail = this.newInvestorValues.email;
    const currentInvestors = PortfolioStore.currentPortfolioInvestors;
    let hasDuplicate = true;

    if (currentInvestors) {
      const result = currentInvestors.filter(x => x.email === currentEmail);

      if (result.length > 0) {
        NotificationStore.addMessage('errorMessages', 'Email already exists in this Portfolio');
        hasDuplicate = false;
      }
    }

    return hasDuplicate;
  }

  @action
  // eslint-disable-next-line class-methods-use-this
  handleIsPortfolioSelected() {
    if (!PortfolioStore.selectedPortfolioId) {
      NotificationStore.addMessage('errorMessages', 'Please select Portfolio first');
      return false;
    }
    return true;
  }
  // #endregion

  // Resets
  // #region Resets
  @action
  reset() {
    console.log(this.newInvestorValues);
    this.newInvestorValues.isFounder = false;
    this.newInvestorValues.fullName = '';
    this.newInvestorValues.email = '';
    this.newInvestorValues.telephone = '';
    this.newInvestorValues.dateOfEntry = '';
    this.newInvestorValues.depositedAmount = '';
    // this.newInvestorValues.depositUsdEquiv = '';
    this.newInvestorValues.managementFee = '';
    this.newInvestorValues.sharePriceAtEntryDate = '';
    this.newInvestorValues.purchasedShares = '';
  }

  @action
  resetUpdate() {
    console.log(this.updateInvestorValues);
    this.updateInvestorValues.fullName = '';
    this.updateInvestorValues.email = '';
    this.updateInvestorValues.telephone = '';
    this.updateInvestorValues.managementFee = '';

    this.selectedInvestor = '';
  }

  @action.bound
  resetDeposit() {
    console.log(this.newDepositValues);
    this.newDepositValues.amount = '';
    this.newDepositValues.transactionDate = '';
    this.newDepositValues.sharePriceAtEntryDate = '';
    this.newDepositValues.purchasedShares = '';

    this.selectedInvestor = '';
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

    this.selectedInvestor = '';
  }
  // #endregion

  // Others
  // #region Others
  @action
  selectInvestor(id) {
    this.selectedInvestorId = id;

    // selects the marked investor
    // eslint-disable-next-line array-callback-return
    PortfolioStore.currentPortfolioInvestors.find((element) => {
      if (element.id === id) {
        this.selectedInvestor = {
          ...element,
        };
      }
    });

    if (this.selectedInvestor) {
      // sets the editing values for the current investor
      this.updateInvestorValues.fullName = this.selectedInvestor.fullName;
      this.updateInvestorValues.email = this.selectedInvestor.email;
      this.updateInvestorValues.telephone = this.selectedInvestor.telephone;
      this.updateInvestorValues.managementFee = this.selectedInvestor.managementFee;
    }
  }

  @computed
  get depositUsdEquiv() {
    const baseCurrency = MarketStore.selectedBaseCurrency;
    const currentAmount = this.newInvestorValues.depositedAmount || this.newDepositValues.amount;
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

      return calculatedDepositUsdEquiv;
    }

    return null;
  }
  // #endregion
}

export default new InvestorStore();
