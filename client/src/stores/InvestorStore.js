/* eslint no-prototype-builtins: 0 */
/* eslint no-console: 0 */
import { observable, action, computed } from 'mobx';
import requester from '../services/requester';
import PortfolioStore from './PortfolioStore';
import MarketStore from './MarketStore';
import NotificationStore from './NotificationStore';
import TransactionStore from './TransactionStore';
import BigNumberService from '../services/BigNumber';

class InvestorStore {
  @observable newInvestorValues;
  @observable updateInvestorValues;
  @observable selectedInvestorIndividualSummary;
  @observable selectedInvestorIndividualSummaryId;
  @observable selectedInvestor;
  @observable selectedInvestorId;
  @observable selectedInvestorIndividualSummaryTransactions;

  constructor() {
    this.newInvestorValues = {
      name: '',
      email: '',
      phone: '',
      fee: '',
    };
    this.updateInvestorValues = {
      name: '',
      email: '',
      phone: '',
      fee: '',
    };
    this.selectedInvestor = null;
    this.selectedInvestorId = null;
    this.selectedInvestorIndividualSummary = null;
    this.selectedInvestorIndividualSummaryId = null;
    this.selectedInvestorIndividualSummaryTransactions = null;
  }

  @computed
  get selectedInvestorTotalSharesHeld() {
    if (TransactionStore.transactions.length !== 0 && this.selectedInvestorIndividualSummary !== null) {
      let result = 0;
      const transactions = TransactionStore.transactions.filter(item => item.investorId === this.selectedInvestorIndividualSummary.id);
      transactions.forEach((tr) => {
        if (tr.type === 'd') {
          result = BigNumberService.sum(result, tr.sharesCreated);
        } else {
          result = BigNumberService.difference(result, tr.sharesLiquidated);
        }
      });
      return result;
    }
    return '';
  }

  @computed
  // eslint-disable-next-line class-methods-use-this
  get investorsShares() {
    if (TransactionStore.transactions.length !== 0 && PortfolioStore.currentPortfolioInvestors !== null) {
      const result = [];
      PortfolioStore.currentPortfolioInvestors.forEach((investor) => {
        const transactions = TransactionStore.transactions.filter(transaction => transaction.investorId === investor.id);
        let shares = 0;
        transactions.forEach((transaction) => {
          if (transaction.type === 'd') {
            shares = BigNumberService.sum(shares, transaction.sharesCreated);
          } else {
            shares = BigNumberService.difference(shares, transaction.sharesLiquidated);
          }
        });
        result.push({ name: investor.name, id: investor.id, shares });
      });
      return result;
    }
    return [];
  }

  @action
  ableToassignTransaction(transaction, investorName, investorId) {
    const shares = this.investorsShares;
    const currentInvestorShares = shares.filter(item => item.id === investorId);
    const total = currentInvestorShares.reduce((acc, obj) => BigNumberService.sum(acc, obj.shares), 0);
    return transaction.type === 'd' || (transaction.type === 'w' && transaction.sharesLiquidated <= total);
  }

  @computed
  get individualWeightedEntryPrice() {
    if (this.selectedInvestorIndividualSummary && this.selectedInvestorTotalSharesHeld !== null) {
      let totalInvestmentValue = 0;
      let totalSharesBought = 0;
      this.selectedInvestorIndividualSummaryTransactions.forEach((transaction) => {
        if (transaction.type === 'd') {
          totalInvestmentValue += transaction.totalValueUSD;
          totalSharesBought += transaction.sharesCreated;
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
      return BigNumberService.product(this.selectedInvestorTotalSharesHeld, PortfolioStore.currentPortfolioSharePrice);
    }

    return null;
  }

  @computed
  get individualBTCEquivalent() {
    if (this.selectedInvestorIndividualSummary && MarketStore.marketPriceHistory) {
      const btc = MarketStore.marketPriceHistory.BTC;
      return BigNumberService.quotient(this.individualETHEquivalent, btc.price);
    }

    return null;
  }

  @computed
  get individualETHEquivalent() {
    if (this.selectedInvestorIndividualSummary && MarketStore.ethToUsd) {
      return BigNumberService.quotient(this.individualUSDEquivalent, MarketStore.ethToUsd);
    }

    return null;
  }

  @computed
  get individualInvestmentPeriod() {
    if (this.selectedInvestorIndividualSummary) {
      // Get 1 day in milliseconds
      const oneDay = 1000 * 60 * 60 * 24;
      const currentDate = new Date();
      const dateOfEntryConverted = new Date(this.selectedInvestorIndividualSummary.createdAt);
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
      const calculatedIndividualFeePotential = (this.individualUSDEquivalent * this.selectedInvestorIndividualSummary.fee) / 100;

      return calculatedIndividualFeePotential;
    }

    return null;
  }

  @computed
  // eslint-disable-next-line class-methods-use-this
  get totalFeePotential() {
    if (PortfolioStore.selectedPortfolio) {
      let totalFeeValue = 0;
      PortfolioStore.currentPortfolioInvestors.forEach((el) => {
        let result = 0;
        const transactions = TransactionStore.transactions.filter(item => item.investorId === el.id);
        transactions.forEach((tr) => {
          if (tr.type === 'd') {
            result = BigNumberService.sum(result, tr.sharesCreated);
          } else {
            result = BigNumberService.difference(result, tr.sharesLiquidated);
          }
        });
        totalFeeValue += result * (el.fee / 100) * PortfolioStore.currentPortfolioSharePrice;
      });

      return totalFeeValue;
    }

    return 0;
  }

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

  // Investor -> New, Update, Deposit, Withdraw
  // #region Investor
  @action.bound
  createNewInvestor(portfolioId) {
    const newInvestor = {
      portfolioId,
      name: this.newInvestorValues.name,
      email: this.newInvestorValues.email,
      phone: this.newInvestorValues.phone,
      fee: this.newInvestorValues.fee,
    };

    requester.Investor.add(newInvestor)
      .then(action(() => {
        NotificationStore.addMessage('successMessages', 'Investor created successfully!');
        PortfolioStore.getCurrentPortfolioInvestors();
      }))
      .catch((err) => {
        NotificationStore.addMessage('errorMessages', 'Error occurred, please try again.');
        console.log(err);
      });
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

    const addPortfolioId = Object.assign({}, finalResult, { portfolioId: PortfolioStore.selectedPortfolioId });

    requester.Investor.update(investorId, addPortfolioId)
      .then(action(() => {
        NotificationStore.addMessage('successMessages', 'Investor updated successfully!');
        const portfolioInvestors = PortfolioStore.currentPortfolioInvestors;
        TransactionStore.getTransactions();
        portfolioInvestors.forEach((investor) => {
          if (investor.id === investorId) {
            // eslint-disable-next-line no-restricted-syntax
            for (const key in investor) {
              if (investor.hasOwnProperty(key) && finalResult.hasOwnProperty(key)) {
                investor[key] = addPortfolioId[key]; // eslint-disable-line
              }
            }
          }
        });
      }))
      .catch((err) => {
        NotificationStore.addMessage('errorMessages', 'Error occurred, please try again.');
        console.log(err);
      });
  }

  // Validations
  @action
  handleAddInvestorErrors() {
    const currentInvestor = this.newInvestorValues;
    let noErrors = true;

    // Checks if portfolio is selected
    noErrors = this.handleIsPortfolioSelected();
    noErrors = this.handleEmailValidation();


    // Checks the currently entered values. If value is empty and it is required,
    // than adds a error massage to the array of errors
    Object.keys(currentInvestor).forEach((prop) => {
      // if (currentInvestor[prop] === '' && prop === 'depositedAmount') {
      //   // NotificationStore.addMessage('errorMessages', 'Deposited amount is required.');
      //   noErrors = false;
      // }
      if (currentInvestor[prop] === '' && prop === 'email') {
        // NotificationStore.addMessage('errorMessages', 'Email is required.');
        noErrors = false;
      }
      if (currentInvestor[prop] === '' && prop === 'name') {
        // NotificationStore.addMessage('errorMessages', 'Full name is required.');
        noErrors = false;
      }
      if (currentInvestor[prop] === '' && prop === 'fee') {
        // NotificationStore.addMessage('errorMessages', 'Management Fee is required.');
        noErrors = false;
      }
    });

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

  // #region Resets
  @action
  reset() {
    this.newInvestorValues.name = '';
    this.newInvestorValues.email = '';
    this.newInvestorValues.phone = '';
    this.newInvestorValues.fee = '';
  }

  @action
  resetUpdate() {
    this.updateInvestorValues.name = '';
    this.updateInvestorValues.email = '';
    this.updateInvestorValues.phone = '';
    this.updateInvestorValues.fee = '';

    this.selectedInvestor = '';
  }

  @action.bound
  resetSelectedInvestor() {
    this.selectedInvestorId = null;
    this.selectedInvestorIndividualSummary = null;
    this.selectedInvestorIndividualSummaryTransactions = null;
    this.selectedInvestorIndividualSummaryId = null;
  }

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
      this.updateInvestorValues.name = this.selectedInvestor.name;
      this.updateInvestorValues.email = this.selectedInvestor.email;
      this.updateInvestorValues.phone = this.selectedInvestor.phone;
      this.updateInvestorValues.fee = this.selectedInvestor.fee;
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

    this.selectedInvestorIndividualSummaryTransactions = TransactionStore.transactions
      .filter(t => t.investorId === id);
  }
}

export default new InvestorStore();
