/* eslint no-prototype-builtins: 0 */
/* eslint no-console: 0 */
import { observable, action, computed } from 'mobx';
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
      isFounder: false, // this stays, because BE model still has it
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
  get selectedInvestorTotalSharesHeld() {
    if (this.selectedInvestorIndividualSummary) {
      if (this.selectedInvestorIndividualSummary.purchasedShares === null) {
        return 0;
      }

      return this.selectedInvestorIndividualSummary.purchasedShares;
    }

    return null;
  }

  @action
  withdrawAllShares() {
    if (MarketStore.selectedBaseCurrency && this.selectedInvestorIndividualSummary) {
      const allSharesInUsd = this.selectedInvestorTotalSharesHeld * PortfolioStore.currentPortfolioSharePrice; // number
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
    if (this.selectedInvestorIndividualSummary && this.selectedInvestorTotalSharesHeld !== null) {
      let totalInvestmentValue = 0;
      let totalSharesBought = 0;
      this.selectedInvestorIndividualSummaryTransactions.forEach((transaction) => {
        if (transaction.amountInUSD > 0) {
          totalInvestmentValue += transaction.amountInUSD;
          totalSharesBought += transaction.shares;
        }
      });

      if (totalSharesBought !== 0) {
        const calculatedIndividualWeightedEntryPrice = totalInvestmentValue / totalSharesBought;
        return calculatedIndividualWeightedEntryPrice;
      }

      return null;
    }

    return null;
  }

  @computed
  get individualUSDEquivalent() {
    if (this.selectedInvestorIndividualSummary) {
      const calculatedIndividualUSDEquivalent = this.selectedInvestorTotalSharesHeld * PortfolioStore.currentPortfolioSharePrice;

      return calculatedIndividualUSDEquivalent;
    }

    return null;
  }

  @computed
  get individualBTCEquivalent() {
    if (this.selectedInvestorIndividualSummary) {
      const calculatedIndividualBTCEquivalent = this.individualUSDEquivalent / MarketStore.baseCurrencies[3].last;

      return calculatedIndividualBTCEquivalent;
    }

    return null;
  }

  @computed
  get individualETHEquivalent() {
    if (this.selectedInvestorIndividualSummary && MarketStore.baseCurrencies) {
      const calculatedIndividualETHEquivalent = this.individualBTCEquivalent / MarketStore.baseCurrencies[0].last;

      return calculatedIndividualETHEquivalent;
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
    if (this.selectedInvestorIndividualSummary && this.individualWeightedEntryPrice !== null) {
      if (this.individualWeightedEntryPrice === 0) {
        return 0;
      }
      const calculatedIndividualProfit = ((PortfolioStore.currentPortfolioSharePrice - this.individualWeightedEntryPrice) /
        this.individualWeightedEntryPrice) * 100;

      return calculatedIndividualProfit;
    }

    return null;
  }

  @computed
  get individualFeePotential() {
    if (this.selectedInvestorIndividualSummary) {
      const calculatedIndividualFeePotential = (this.individualUSDEquivalent * this.selectedInvestorIndividualSummary.managementFee) / 100;

      return calculatedIndividualFeePotential;
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
  // Investor Set Values -> New, Update, Deposit, Withdraw
  // #region Investor Set Values
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
  @action.bound
  createNewInvestor(portfolioId) {
    let dateOfEntry = null;
    if (this.newInvestorValues.dateOfEntry) {
      dateOfEntry = new Date(this.newInvestorValues.dateOfEntry).toISOString();
    } else {
      dateOfEntry = new Date().toISOString();
    }

    const newInvestor = {
      portfolioId,
      dateOfEntry,
      isFounder: this.newInvestorValues.isFounder,
      fullName: this.newInvestorValues.fullName,
      email: this.newInvestorValues.email,
      telephone: this.newInvestorValues.telephone,
      managementFee: this.newInvestorValues.managementFee,
    };

    const depositData = {
      currency: MarketStore.selectedBaseCurrency.pair,
      balance: +this.newInvestorValues.depositedAmount,
      portfolioId,
      transaction: {
        portfolioId,
        dateOfEntry,
        investorName: this.newInvestorValues.fullName,
        amountInUSD: this.convertedUsdEquiv(),
        sharePrice: PortfolioStore.currentPortfolioSharePrice,
        shares: parseFloat(this.newInvestorValues.purchasedShares),
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
            PortfolioStore.selectedPortfolio.shares += response.data.shares;

            PortfolioStore.getCurrentPortfolioAssets();
          }))
          .catch(err => console.log(err));
      }))
      .catch(err => console.log(err));
  }

  @action.bound
  createDefaultInvestor(newPortfolio) {
    const newInvestor = {
      isFounder: true,
      fullName: 'default investor',
      email: 'default@email.com',
      telephone: '',
      dateOfEntry: new Date().toISOString(),
      managementFee: '0.0',
      portfolioId: newPortfolio.id,
    };
    let depositData;
    if (MarketStore.selectedBaseCurrency) {
      depositData = {
        currency: MarketStore.selectedBaseCurrency.pair,
        balance: +this.newInvestorValues.depositedAmount,
        portfolioId: newPortfolio.id,
        transaction: {
          investorName: 'default investor',
          dateOfEntry: new Date().toISOString(),
          // transactionDate: (new Date()).toLocaleString(),
          amountInUSD: this.convertedUsdEquiv(),
          sharePrice: 1,
          shares: parseFloat(this.convertedUsdEquiv()),
          portfolioId: newPortfolio.id,
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
              // Update portfolios array
              newPortfolio.shares = response.data.shares; // eslint-disable-line
              PortfolioStore.portfolios.push(newPortfolio);

              // Update current selected portfolio
              PortfolioStore.selectPortfolio(newPortfolio.id);

              // Update current selected portfolio transactions
              PortfolioStore.currentPortfolioTransactions.push(response.data);

              NotificationStore.addMessage('successMessages', 'Successfully created portfolio');
              PortfolioStore.resetPortfolio();
              MarketStore.selectedBaseCurrency = '';
            }))
            .then(action(() => {
              this.reset();
              PortfolioStore.resetPortfolio();
            }))
            .catch(err => console.log(err));
        } else {
          // Update portfolios array
          PortfolioStore.portfolios.push(newPortfolio);

          // Update current selected portfolio
          PortfolioStore.selectPortfolio(newPortfolio.id);

          NotificationStore.addMessage('successMessages', 'Successfully created portfolio');
          PortfolioStore.resetPortfolio();
          MarketStore.selectedBaseCurrency = '';
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
        PortfolioStore.getCurrentPortfolioTransactions();
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

  @action.bound
  createNewDepositInvestor(id) {
    let dateOfEntry = null;
    if (this.newDepositValues.transactionDate) {
      dateOfEntry = new Date(this.newDepositValues.transactionDate).toISOString();
    } else {
      dateOfEntry = new Date().toISOString();
    }
    const selectedCurrencyName = MarketStore.selectedBaseCurrency.pair;
    const depositedShares = parseFloat(this.newDepositValues.purchasedShares);
    const deposit = {
      currency: selectedCurrencyName,
      balance: +this.newDepositValues.amount,
      portfolioId: PortfolioStore.selectedPortfolioId,
      investorId: id,
      transaction: {
        dateOfEntry,
        investorName: this.selectedInvestor.fullName,
        // transactionDate: this.newDepositValues.transactionDate || today,
        amountInUSD: this.convertedUsdEquiv(),
        sharePrice: PortfolioStore.currentPortfolioSharePrice,
        shares: depositedShares,
        portfolioId: PortfolioStore.selectedPortfolioId,
        investorId: id,
      },
    };

    requester.Investor.addDeposit(deposit)
      .then(action((result) => {
        PortfolioStore.addTransaction(result.data);
        PortfolioStore.selectedPortfolio.shares += depositedShares;

        const indexOfInvestor = PortfolioStore.currentPortfolioInvestors.findIndex(investor => investor.id === this.selectedInvestor.id);
        if (indexOfInvestor > -1) {
          PortfolioStore.currentPortfolioInvestors[indexOfInvestor].purchasedShares += depositedShares;
        }

        const assetToChange = PortfolioStore.currentPortfolioAssets.filter(el => el.currency === selectedCurrencyName);
        if (assetToChange.length > 0) {
          assetToChange[0].balance += depositedShares;
        }

        NotificationStore.addMessage('successMessages', 'Deposit completed successfully');
        this.resetDeposit();
        this.resetSelectedInvestor();
        MarketStore.resetMarket();
      }));
  }

  @action.bound
  withdrawalInvestor(id) {
    let dateOfEntry = null;
    if (this.withdrawalValues.transactionDate) {
      dateOfEntry = new Date(this.withdrawalValues.transactionDate).toISOString();
    } else {
      dateOfEntry = new Date().toISOString();
    }
    const selectedCurrencyName = MarketStore.selectedBaseCurrency.pair;
    const withdrawnShares = this.withdrawalValues.purchasedShares;
    const withdrawal = {
      currency: selectedCurrencyName,
      balance: +this.withdrawalValues.amount,
      portfolioId: PortfolioStore.selectedPortfolioId,
      investorId: id,
      transaction: {
        dateOfEntry,
        investorName: this.selectedInvestor.fullName,
        // transactionDate: this.withdrawalValues.transactionDate || today,
        amountInUSD: this.convertedUsdEquiv(),
        sharePrice: PortfolioStore.currentPortfolioSharePrice,
        shares: parseFloat(withdrawnShares),
        portfolioId: PortfolioStore.selectedPortfolioId,
        investorId: id,
      },
    };

    requester.Investor.withdrawal(withdrawal)
      .then(action((result) => {
        PortfolioStore.addTransaction(result.data);
        PortfolioStore.selectedPortfolio.shares -= withdrawnShares;

        const indexOfInvestor = PortfolioStore.currentPortfolioInvestors.findIndex(investor => investor.id === this.selectedInvestor.id);
        if (indexOfInvestor > -1) {
          PortfolioStore.currentPortfolioInvestors[indexOfInvestor].purchasedShares -= withdrawnShares;
        }

        const assetToChange = PortfolioStore.currentPortfolioAssets.filter(el => el.currency === selectedCurrencyName);
        if (assetToChange.length > 0) {
          assetToChange[0].balance -= withdrawnShares;
        }

        NotificationStore.addMessage('successMessages', 'Withdraw completed successfully');
        this.resetWithdrawal();
        this.resetSelectedInvestor();
        MarketStore.resetMarket();
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
    let noErrors = true;

    // Checks if portfolio is selected
    noErrors = this.handleIsPortfolioSelected();

    return noErrors;
  }

  @action
  handleWithdrawalInvestorErrors() {
    let noErrors = true;

    if (PortfolioStore.currentPortfolioAssets.length === 0) {
      NotificationStore.addMessage('errorMessages', 'Please select Investor!');
      noErrors = false;
      return noErrors;
    }

    const hasInputShares = this.selectedInvestor !== null ? this.selectedInvestor.purchasedShares : 0;
    const hasEnoughShares = hasInputShares >= this.withdrawalValues.purchasedShares;
    if (!hasEnoughShares) {
      NotificationStore.addMessage('errorMessages', 'The investor has not enough shares!');
      noErrors = false;
    }

    if (MarketStore.selectedBaseCurrency === null) {
      NotificationStore.addMessage('errorMessages', 'Please select currency!');
      noErrors = false;
      return noErrors;
    }

    const availableAssets = PortfolioStore.currentPortfolioAssets;
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
    this.selectedInvestorIndividualSummary = null;
    this.selectedInvestorIndividualSummaryTransactions = null;
  }
  // #endregion

  // #region Others
  @action.bound
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

  // eslint-disable-next-line class-methods-use-this
  nearZeroRounding(value, places) {
    if (value > 0) {
      return Number(`${Math.round(`${value}e${places}`)}e-${places}`);
    } else if (value === 0 || value > `1e-${places}`) {
      return value.toFixed(places);
    } else if (value < `1e-${places}`) {
      return Number(`${Math.round(`${value}e${places}`)}e-${places}`);
    } else {
      return value;
    }
  }

  // #endregion
}

export default new InvestorStore();
