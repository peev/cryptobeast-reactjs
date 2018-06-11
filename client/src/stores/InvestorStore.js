/* eslint no-prototype-builtins: 0 */
/* eslint no-console: 0 */
import {
  observable,
  action,
  computed,
  toJS,
} from 'mobx';
import requester from '../services/requester';
import PortfolioStore from './PortfolioStore';
import MarketStore from './MarketStore';
import NotificationStore from './NotificationStore';
// import InvestorDeposit from '../components/Modal/InvestorModals/InvestorDeposit';

class InvestorStore {
  @observable newInvestorValues;
  @observable updateInvestorValues;
  @observable newDepositValues;
  @observable withdrawalValues;
  // @observable individualSummaryValues;
  @observable selectedInvestorIndividualSummary;
  @observable selectedInvestorIndividualSummaryId;
  @observable selectedInvestor;
  @observable selectedInvestorId;
  @observable selectedInvestorIndividualSummaryTransactions;

  constructor() {
    // #region Initialize Values
    this.newInvestorValues = {
      isFounder: false,
      fullName: '',
      email: '',
      telephone: '',
      dateOfEntry: '',
      depositedAmount: '',
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
    this.selectedInvestor = null;
    this.selectedInvestorId = null;
    // Individual summary
    this.selectedInvestorIndividualSummary = null;
    this.selectedInvestorIndividualSummaryId = null;
    this.selectedInvestorIndividualSummaryTransactions = null;
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
      const calculatedPurchasedShares = (this.convertedUsdEquiv() / (currentPortfolioSharePrice || 1)).toFixed(2);
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
      const calculatedPurchasedShares = (this.convertedUsdEquiv() / currentPortfolioSharePrice).toFixed(2);
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

      const calculatedWithdrawPurchasedShares = (this.convertedUsdEquiv() / currentPortfolioSharePrice).toFixed(2);
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
    if (this.selectedInvestorIndividualSummary) {
      return this.selectedInvestorIndividualSummary.purchasedShares;
    }

    return null;
  }

  @action
  widthdrawAllShares() {
    if (MarketStore.selectedBaseCurrency && this.selectedInvestorIndividualSummary) {
      const allSharesInUsd = this.individualSharesHeld * PortfolioStore.currentPortfolioSharePrice; // number
      const currency = MarketStore.selectedBaseCurrency; // obj{last... pair...}
      let calculatedEquiv;
      switch (currency.pair) {
        case 'JPY':
        case 'EUR':
        case 'USD':
          calculatedEquiv = (allSharesInUsd / MarketStore.baseCurrencyInUSD.last) * currency.last;
          break;
        case 'ETH':
          calculatedEquiv = (allSharesInUsd / MarketStore.baseCurrencyInUSD.last) / currency.last;
          break;
        case 'BTC':
          calculatedEquiv = allSharesInUsd / MarketStore.baseCurrencyInUSD.last;
          break;
        default:
          console.log('There is no such currency');
          break;
      }
      this.setWithdrawInvestorValues('amount', calculatedEquiv);
    }
    return null;
  }

  @computed
  get individualWeightedEntryPrice() {
    if (this.selectedInvestorIndividualSummary && this.selectedInvestorIndividualSummaryTransactions) {
      const calculatedIndividualWeightedEntryPrice = this.selectedInvestorIndividualSummaryTransactions.reduce((result, transaction) => {
        result += (transaction.shares / this.individualSharesHeld) * transaction.sharePrice; // eslint-disable-line no-param-reassign
        return result;
      }, 0);

      return Number(`${Math.round(`${calculatedIndividualWeightedEntryPrice}e2`)}e-2`);
    }

    return null;
  }

  @computed
  get individualUSDEquivalent() {
    if (this.selectedInvestorIndividualSummary) {
      const calculatedIndividualUSDEquivalent = this.individualSharesHeld * PortfolioStore.currentPortfolioSharePrice;

      return Number(`${Math.round(`${calculatedIndividualUSDEquivalent}e2`)}e-2`);
    }

    return null;
  }

  @computed
  get individualBTCEquivalent() {
    if (this.selectedInvestorIndividualSummary) {
      const calculatedIndividualBTCEquivalent = this.individualUSDEquivalent / MarketStore.baseCurrencies[3].last;

      return Number(`${Math.round(`${calculatedIndividualBTCEquivalent}e2`)}e-2`);
    }

    return null;
  }

  @computed
  get individualETHEquivalent() {
    if (this.selectedInvestorIndividualSummary && MarketStore.baseCurrencies) {
      const calculatedIndividualETHEquivalent = this.individualBTCEquivalent / MarketStore.baseCurrencies[0].last;

      return Number(`${Math.round(`${calculatedIndividualETHEquivalent}e2`)}e-2`);
    }

    return null;
  }

  @computed
  get individualInvestmentPeriod() {
    if (this.selectedInvestorIndividualSummary) {
      // Get 1 day in milliseconds
      const oneDay = 1000 * 60 * 60 * 24;
      const currentDate = new Date();
      const dateOfEntryConverted = new Date(this.selectedInvestorIndividualSummary.dateOfEntry);
      const calculatedIndividualInvestmentPeriod = Math.round((currentDate - dateOfEntryConverted) / oneDay);

      return calculatedIndividualInvestmentPeriod;
    }

    return null;
  }

  @computed
  get individualProfit() {
    if (this.selectedInvestorIndividualSummary) {
      let calculatedIndividualProfit = (PortfolioStore.currentPortfolioSharePrice - this.individualWeightedEntryPrice) /
        (this.individualWeightedEntryPrice || 1);
      calculatedIndividualProfit = Number(`${Math.round(`${calculatedIndividualProfit}e2`)}e-2`);

      return Number(`${Math.round(`${calculatedIndividualProfit}e2`)}e-2`);
    }

    return null;
  }

  @computed
  get individualFeePotential() {
    if (this.selectedInvestorIndividualSummary) {
      const calculatedIndividualFeePotential = (this.individualUSDEquivalent * this.selectedInvestorIndividualSummary.managementFee) / 100;

      return Number(`${Math.round(`${calculatedIndividualFeePotential}e2`)}e-2`);
    }

    return null;
  }
  // #endregion
  @computed
  // eslint-disable-next-line class-methods-use-this
  get totalFeePotential() {
    if (PortfolioStore.selectedPortfolio) {
      let totalFeeValue = 0;
      PortfolioStore.currentPortfolioInvestors.forEach((el) => {
        totalFeeValue += el.purchasedShares * (el.managementFee / 100) * PortfolioStore.currentPortfolioSharePrice;
      });

      return this.prettifyNumber(totalFeeValue);
    }

    return 0;
  }
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
  createNewInvestor(portfolioId) {
    const today = new Date().toISOString().substring(0, 10);
    const newInvestor = {
      isFounder: this.newInvestorValues.isFounder,
      fullName: this.newInvestorValues.fullName,
      email: this.newInvestorValues.email,
      telephone: this.newInvestorValues.telephone,
      dateOfEntry: this.newInvestorValues.dateOfEntry || today,
      managementFee: this.newInvestorValues.managementFee,
      portfolioId,
    };

    const depositData = {
      currency: MarketStore.selectedBaseCurrency.pair,
      balance: +this.newInvestorValues.depositedAmount,
      portfolioId,
      transaction: {
        investorName: this.newInvestorValues.fullName,
        dateOfEntry: (new Date()).toLocaleString(),
        transactionDate: this.newInvestorValues.dateOfEntry || today,
        amountInUSD: this.convertedUsdEquiv(),
        sharePrice: PortfolioStore.currentPortfolioSharePrice,
        shares: parseFloat(this.newInvestorValues.purchasedShares),
        portfolioId,
      },
    };

    requester.Investor.add(newInvestor)
      .then(action((result) => {
        const createdInvestor = result.data;
        Object.assign(depositData.transaction, { investorId: createdInvestor.id });
        requester.Investor.addDeposit(depositData)
          .then(action((response) => {
            createdInvestor.purchasedShares = response.data.shares;
            PortfolioStore.currentPortfolioInvestors.push(createdInvestor);
            PortfolioStore.currentPortfolioTransactions.push(response.data);
            PortfolioStore.selectedPortfolioShares += response.data.shares;
          }))
          .catch(err => console.log(err));
      }))
      .catch(err => console.log(err));
  }

  @action.bound
  createDefaultInvestor(portfolioId) {
    const newInvestor = {
      isFounder: true,
      fullName: 'default investor',
      email: 'default@email.com',
      telephone: '',
      dateOfEntry: (new Date()).toLocaleString(),
      managementFee: 0,
      portfolioId,
    };
    let depositData;
    if (MarketStore.selectedBaseCurrency) {
      depositData = {
        currency: MarketStore.selectedBaseCurrency.pair,
        balance: +this.newInvestorValues.depositedAmount,
        portfolioId,
        transaction: {
          investorName: 'default investor',
          dateOfEntry: (new Date()).toLocaleString(),
          transactionDate: (new Date()).toLocaleString(),
          amountInUSD: this.convertedUsdEquiv(),
          sharePrice: 1,
          shares: parseFloat(this.convertedUsdEquiv()),
          portfolioId,
        },
      };
    }


    return requester.Investor.add(newInvestor)
      .then(action((result) => {
        PortfolioStore.currentPortfolioInvestors.push(result.data);
        if (depositData) {
          Object.assign(depositData.transaction, { investorId: result.data.id });
          requester.Investor.addDeposit(depositData)
            .then(action((response) => {
              PortfolioStore.currentPortfolioTransactions.push(response.data);
            }))
            .then(action(() => {
              this.reset();
              PortfolioStore.resetPortfolio();
            }))
            .catch(err => console.log(err));
        } else {
          PortfolioStore.resetPortfolio();
        }
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
      .then(action(() => {
        const portfolioInvestors = PortfolioStore.currentPortfolioInvestors;
        // console.log(PortfolioStore.currentPortfolioInvestors, finalResult, investorId)
        portfolioInvestors.forEach((investor) => {
          if (investor.id === investorId) {
            // eslint-disable-next-line no-restricted-syntax
            for (const key in investor) {
              if (investor.hasOwnProperty(key) && finalResult.hasOwnProperty(key)) {
                investor[key] = finalResult[key]; // eslint-disable-line
              }
            }
          }
        });
      }))
      .catch(err => console.log(err));
  }

  @action
  createNewDepositInvestor(id) {
    const today = new Date().toISOString().substring(0, 10);
    const deposit = {
      currency: MarketStore.selectedBaseCurrency.pair,
      balance: +this.newDepositValues.amount,
      portfolioId: PortfolioStore.selectedPortfolioId,
      investorId: id,
      transaction: {
        investorName: this.selectedInvestor.fullName,
        dateOfEntry: (new Date()).toLocaleString(),
        transactionDate: this.newDepositValues.transactionDate || today,
        amountInUSD: this.convertedUsdEquiv(),
        sharePrice: PortfolioStore.currentPortfolioSharePrice,
        shares: parseFloat(this.newDepositValues.purchasedShares),
        portfolioId: PortfolioStore.selectedPortfolioId,
        investorId: id,
      },
    };

    requester.Investor.addDeposit(deposit)
      .then((result) => {
        PortfolioStore.addTransaction(result.data);
        PortfolioStore.getPortfolios().then(() => {
          this.selectInvestor(result.data.investorId);
        })
          .catch(err => console.log(err));
      });
  }

  @action
  withdrawalInvestor(id) {
    const today = new Date().toISOString().substring(0, 10);
    const withdrawal = {
      currency: MarketStore.selectedBaseCurrency.pair,
      balance: +this.withdrawalValues.amount,
      portfolioId: PortfolioStore.selectedPortfolioId,
      investorId: id,
      transaction: {
        investorName: this.selectedInvestor.fullName,
        dateOfEntry: (new Date()).toLocaleString(),
        transactionDate: this.withdrawalValues.transactionDate || today,
        amountInUSD: this.convertedUsdEquiv(),
        sharePrice: PortfolioStore.currentPortfolioSharePrice,
        shares: parseFloat(this.withdrawalValues.purchasedShares),
        portfolioId: PortfolioStore.selectedPortfolioId,
        investorId: id,
      },
    };

    requester.Investor.withdrawal(withdrawal)
      .then(action((result) => {
        PortfolioStore.addTransaction(result.data);
        PortfolioStore.getPortfolios().then(action(() => {
          this.selectInvestor(result.data.investorId);
          NotificationStore.addMessage('successMessages', 'Widthdraw completed successfuly');
        }));
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

    noErrors = this.handleEmailValidation();
    // Checks if base currency is added
    if (baseCurrency === null) {
      // NotificationStore.addMessage('errorMessages', 'Please select currency');
      noErrors = false;
    }

    // Checks if email is valid - duplication only


    // Checks the currently entered values. If value is empty and it is required,
    // than adds a error massage to the array of errors
    Object.keys(currentInvestor).forEach((prop) => {
      // if (currentInvestor[prop] === '' && prop === 'dateOfEntry') {
      //   // NotificationStore.addMessage('errorMessages', 'Entry date is required.');
      //   noErrors = false;
      // }
      if (currentInvestor[prop] === '' && prop === 'depositedAmount') {
        // NotificationStore.addMessage('errorMessages', 'Deposited amount is required.');
        noErrors = false;
      }
      if (currentInvestor[prop] === '' && prop === 'email') {
        // NotificationStore.addMessage('errorMessages', 'Email is required.');
        noErrors = false;
      }
      if (currentInvestor[prop] === '' && prop === 'fullName') {
        // NotificationStore.addMessage('errorMessages', 'Full name is required.');
        noErrors = false;
      }
      if (currentInvestor[prop] === '' && prop === 'managementFee') {
        // NotificationStore.addMessage('errorMessages', 'Management Fee is required.');
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
      // NotificationStore.addMessage('errorMessages', 'Please select Investor');
      noErrors = false;
    }

    // Checks if base currency is added
    if (baseCurrency === null) {
      // NotificationStore.addMessage('errorMessages', 'Please select currency');
      noErrors = false;
    }

    // Checks the currently entered values. If value is empty and it is required,
    // than adds a error massage to the array of errors
    Object.keys(currentDeposit).forEach((prop) => {
      // if (currentDeposit[prop] === '' && prop === 'transactionDate') {
      //   // NotificationStore.addMessage('errorMessages', 'Entry date is required.');
      //   noErrors = false;
      // }
      if (currentDeposit[prop] === '' && prop === 'amount') {
        // NotificationStore.addMessage('errorMessages', 'Amount is required.');
        noErrors = false;
      }
    });

    return noErrors;
  }

  @action
  handleWithdrawalInvestorErrors() {
    let noErrors = true;

    const hasInputShares = this.selectedInvestor !== null ? this.selectedInvestor.purchasedShares : 0;
    const hasEnoughShares = hasInputShares >= this.withdrawalValues.purchasedShares;
    if (!hasEnoughShares) {
      NotificationStore.addMessage('errorMessages', 'The investor has not enough shares!');
      noErrors = false;
    }

    const availableAssets = toJS(PortfolioStore.currentPortfolioAssets);
    const wantedAsset = availableAssets.filter(asset => asset.currency === MarketStore.selectedBaseCurrency.pair);
    if (wantedAsset.length === 0) {
      NotificationStore.addMessage('infoMessages', `You need to allocate 
      ${this.withdrawalValues.amount} ${MarketStore.selectedBaseCurrency.pair}`);
      noErrors = false;
    }
    if (wantedAsset.length > 0 && wantedAsset[0].balance < this.withdrawalValues.amount) {
      NotificationStore.addMessage('infoMessages', `You need to allocate 
      ${this.withdrawalValues.amount - wantedAsset[0].balance} ${MarketStore.selectedBaseCurrency.pair}`);
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
    let hasNoDuplicate = true;

    if (currentInvestors) {
      const result = currentInvestors.filter(x => x.email === currentEmail);

      if (result.length > 0) {
        NotificationStore.addMessage('errorMessages', 'Email already exists in this Portfolio');
        hasNoDuplicate = false;
      }
    }

    return hasNoDuplicate;
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

  // #region Resets
  @action
  reset() {
    this.newInvestorValues.isFounder = false;
    this.newInvestorValues.fullName = '';
    this.newInvestorValues.email = '';
    this.newInvestorValues.telephone = '';
    this.newInvestorValues.dateOfEntry = '';
    this.newInvestorValues.depositedAmount = '';
    this.newInvestorValues.managementFee = '';
    this.newInvestorValues.sharePriceAtEntryDate = '';
    this.newInvestorValues.purchasedShares = '';
  }

  @action
  resetUpdate() {
    this.updateInvestorValues.fullName = '';
    this.updateInvestorValues.email = '';
    this.updateInvestorValues.telephone = '';
    this.updateInvestorValues.managementFee = '';

    this.selectedInvestor = '';
  }

  @action.bound
  resetDeposit() {
    this.newDepositValues.amount = '';
    this.newDepositValues.transactionDate = '';
    this.newDepositValues.sharePriceAtEntryDate = '';
    this.newDepositValues.purchasedShares = '';

    this.selectedInvestor = '';
  }

  @action.bound
  resetWithdrawal() {
    this.withdrawalValues.amount = '';
    this.withdrawalValues.transactionDate = '';
    this.withdrawalValues.sharePriceAtEntryDate = '';
    this.withdrawalValues.inUSD = '';
    this.withdrawalValues.purchasedShares = 0;
    this.withdrawalValues.managementFee = '';

    this.selectedInvestor = '';
  }

  @action.bound
  resetSelectedInvestor() {
    this.selectedInvestorId = null;
    this.selectedInvestorIndividualSummaryTransactions = null;
  }
  // #endregion

  // #region Others
  @action
  selectInvestor(id) {
    this.selectedInvestorId = id;
    this.selectedInvestor = {
      ...PortfolioStore.currentPortfolioInvestors
        .find(element => element.id === id),
    };

    if (this.selectedInvestor) {
      // sets the editing values for the current investor
      this.updateInvestorValues.fullName = this.selectedInvestor.fullName;
      this.updateInvestorValues.email = this.selectedInvestor.email;
      this.updateInvestorValues.telephone = this.selectedInvestor.telephone;
      this.updateInvestorValues.managementFee = this.selectedInvestor.managementFee;
    }
  }

  @action
  selectInvestorIndividualSummary(id) {
    this.selectedInvestorIndividualSummaryId = id;
    // selects the marked investor
    // eslint-disable-next-line array-callback-return
    const selectedInvestor = PortfolioStore.currentPortfolioInvestors
      .find(inv => inv.id === id);
    if (selectedInvestor) {
      this.selectedInvestorIndividualSummary = {
        ...selectedInvestor,
      };
    } else {
      this.selectedInvestorIndividualSummary = null;
    }

    this.selectedInvestorIndividualSummaryTransactions = PortfolioStore.currentPortfolioTransactions
      .filter(t => t.investorId === id);

    // if (this.selectedInvestorIndividualSummary) {
    //   // sets the editing values for the current investor
    //   this.updateInvestorValues.fullName = this.selectedInvestorIndividualSummary.fullName;
    //   this.updateInvestorValues.email = this.selectedInvestorIndividualSummary.email;
    //   this.updateInvestorValues.telephone = this.selectedInvestorIndividualSummary.telephone;
    //   this.updateInvestorValues.managementFee = this.selectedInvestorIndividualSummary.managementFee;
    // }
  }

  @action.bound
  convertedUsdEquiv() {
    const baseCurrency = MarketStore.selectedBaseCurrency;
    const currentAmount = this.newInvestorValues.depositedAmount || this.newDepositValues.amount || this.withdrawalValues.amount;
    if (baseCurrency && currentAmount) {
      let calculatedUsdEquiv;
      switch (baseCurrency.pair) {
        case 'JPY':
        case 'EUR':
        case 'USD':
          calculatedUsdEquiv = (currentAmount / baseCurrency.last) * MarketStore.baseCurrencyInUSD.last;
          break;
        case 'ETH':
          calculatedUsdEquiv = currentAmount * baseCurrency.last * MarketStore.baseCurrencyInUSD.last;
          break;
        case 'BTC':
          calculatedUsdEquiv = currentAmount * MarketStore.baseCurrencyInUSD.last;
          break;
        default:
          console.log('The is no such currency');
          break;
      }

      return calculatedUsdEquiv;
    }

    return null;
  }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  prettifyNumber(value) {
    const thousand = 1000;
    const million = 1000000;
    const billion = 1000000000;
    const trillion = 1000000000000;

    let endValue = 0;

    switch (true) {
      case value < thousand:
        endValue = (value).toFixed(1);
        break;
      case value >= thousand && value <= million:
        endValue = `${parseFloat(value / thousand).toFixed(1)}K`;
        break;
      case value >= million && value <= billion:
        endValue = `${parseFloat(value / million).toFixed(1)}M`;
        break;
      case value >= billion && value <= trillion:
        endValue = `${parseFloat(value / billion).toFixed(1)}B`;
        break;
      default:
        endValue = `${parseFloat(value / trillion).toFixed(1)}T`;
        break;
    }
    return endValue;
  }
  // #endregion
}

export default new InvestorStore();
