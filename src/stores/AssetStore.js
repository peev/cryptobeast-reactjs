import { observable, action } from 'mobx';
import requester from '../services/requester';

import PortfolioStore from './PortfolioStore';
import MarketStore from './MarketStore';
import NotificationStore from './NotificationStore';


class AssetStore {
  @observable selectedExchangeBasicInput;
  @observable selectedExchangeCreateAccount;
  @observable selectedExchangeAssetAllocation;

  @observable selectedCurrencyBasicAsset;
  @observable selectedCurrencyFromAssetAllocation;
  @observable selectedCurrencyBalanceFromAssetAllocation;
  @observable selectedCurrencyIdFromAssetAllocation;
  @observable selectedCurrencyToAssetAllocation;
  @observable selectedCurrencyForTransactionFee;

  @observable assetInputValue;
  @observable assetAllocationSelectedDate;
  @observable assetAllocationFromAmount;
  @observable assetAllocationToAmount;
  @observable assetAllocationFee;

  constructor() {
    this.selectedExchangeBasicInput = '';
    this.selectedExchangeCreateAccount = '';
    this.selectedExchangeAssetAllocation = '';
    this.selectedCurrencyBasicAsset = '';
    this.selectedCurrencyFromAssetAllocation = '';
    this.selectedCurrencyBalanceFromAssetAllocation = 0;
    this.selectedCurrencyIdFromAssetAllocation = '';
    this.selectedCurrencyToAssetAllocation = '';
    this.selectedCurrencyForTransactionFee = '';
    this.assetInputValue = '';
    this.assetAllocationSelectedDate = '';
    this.assetAllocationFromAmount = '';
    this.assetAllocationToAmount = '';
    this.assetAllocationFee = '';
  }

  // start: select from all currencies
  @action.bound
  selectCurrencyBasicAsset(value) {
    this.selectedCurrencyBasicAsset = value;
  }

  @action
  selectCurrencyFromAssetAllocation(id) {
    PortfolioStore.currentPortfolioAssets.forEach((el) => {
      if (el.id === id) {
        this.selectedCurrencyFromAssetAllocation = el.currency;
        this.selectedCurrencyBalanceFromAssetAllocation = el.balance;
        this.selectedCurrencyIdFromAssetAllocation = el.id;
      }
    });
  }

  @action.bound
  selectCurrencyToAssetAllocation(value) {
    this.selectedCurrencyToAssetAllocation = value;
  }

  @action.bound
  selectCurrencyForTransactionFee(value) {
    this.selectedCurrencyForTransactionFee = value;
  }
  // end: select from all currencies

  // start: select exchange
  @action.bound
  selectExchangeBasicInput(value) {
    this.selectedExchangeBasicInput = value;
  }

  @action.bound
  selectExchangeAssetAllocation(value) {
    this.selectedExchangeAssetAllocation = value;
  }

  @action.bound
  selectExchangeCreateAccount(value) {
    this.selectedExchangeCreateAccount = value;
  }
  // end: select exchange

  @action
  setBasicAssetInputValue(value) {
    if (value < 0) {
      return;
    }

    this.assetInputValue = value;
  }

  @action.bound
  setAssetAllocationValue(type, value) {
    if (parseInt(value, 10) < 0) {
      NotificationStore.addMessage('errorMessages', 'No negative values.');
      return;
    }
    console.log(type, value);

    if (type === 'assetAllocationFromAmount' &&
      this.selectedCurrencyFromAssetAllocation !== '') {
      if (parseInt(value, 10) > this.selectedCurrencyBalanceFromAssetAllocation) {
        NotificationStore.addMessage('errorMessages', 'Not enough balance');
        return;
      }
    }

    /**
     * This checks if current available asset can be converted to desired output asset.
     * Soo the output asset will not outgrow the available asset
     * currentFromValue => current BTC or other crypto currencies value for available asset
     * currentToValue => current BTC or other crypto currencies value for output asset
     * maxValueToConvert => output asset threshold
     */
    if (type === 'assetAllocationToAmount' &&
      this.selectedCurrencyFromAssetAllocation !== '' &&
      this.selectedCurrencyToAssetAllocation !== '') {
      if (this.assetAllocationFromAmount === '') {
        NotificationStore.addMessage('errorMessages', 'Add amount to covert from');
        return;
      }
      const currentFromValue = this.selectedCurrencyFromAssetAllocation === 'BTC' ?
        MarketStore.marketSummaries[`USDT-${this.selectedCurrencyFromAssetAllocation}`].Last :
        MarketStore.marketSummaries[`BTC-${this.selectedCurrencyFromAssetAllocation}`].Last;

      const currentToValue = this.selectedCurrencyFromAssetAllocation === 'BTC' ?
        MarketStore.marketSummaries[`USDT-${this.selectedCurrencyToAssetAllocation}`].Last :
        MarketStore.marketSummaries[`BTC-${this.selectedCurrencyToAssetAllocation}`].Last;

      const maxValueToConvert = (this.assetAllocationFromAmount * currentFromValue) / currentToValue;

      if (parseInt(value, 10) > maxValueToConvert) {
        NotificationStore.addMessage('errorMessages', `Maximum ${this.selectedCurrencyToAssetAllocation} to convert for: ${maxValueToConvert}`);
        return;
      }
    }


    this[type] = value;
  }

  @action.bound
  handleAssetAllocationErrors() {
    let noErrors = true;

    // Checks if date is entered
    if (this.assetAllocationSelectedDate === '') {
      NotificationStore.addMessage('errorMessages', 'Date of allocation is required.');
      noErrors = false;
    }
    if (this.selectedCurrencyFromAssetAllocation === '') {
      NotificationStore.addMessage('errorMessages', 'Type of currency for paid or sent asset is required');
      noErrors = false;
    }
    if (this.assetAllocationFromAmount === '') {
      NotificationStore.addMessage('errorMessages', 'Amount of bought or received asset is required.');
      noErrors = false;
    }
    if (this.selectedCurrencyToAssetAllocation === '') {
      NotificationStore.addMessage('errorMessages', 'Type of currency for bought or received asset is required.');
      noErrors = false;
    }
    if (this.assetAllocationToAmount === '') {
      NotificationStore.addMessage('errorMessages', 'Amount of bought or received asset is required.');
      noErrors = false;
    }
    if (this.selectedCurrencyForTransactionFee === '') {
      NotificationStore.addMessage('errorMessages', 'Type of currency for asset fee is required.');
      noErrors = false;
    }
    if (this.assetAllocationFee === '') {
      NotificationStore.addMessage('errorMessages', 'Amount of asset fee is required.');
      noErrors = false;
    }

    return noErrors;
  }

  @action
  createBasicAsset(id) {
    if (this.selectedCurrencyBasicAsset === null || this.selectedCurrencyBasicAsset === '') {
      return;
    }

    const parsedAssetInputValue = parseInt(this.assetInputValue, 10);
    if (!Number.isInteger(parsedAssetInputValue) || isNaN(parsedAssetInputValue)) {
      return;
    }

    const selectedExchangeOrigin = this.selectedExchangeBasicInput !== '' ?
      this.selectedExchangeBasicInput :
      'manually added';

    const newBasicAsset = {
      currency: this.selectedCurrencyBasicAsset,
      balance: parsedAssetInputValue,
      origin: selectedExchangeOrigin,
      portfolioId: id,
    };

    requester.Asset.add(newBasicAsset)
      .then(action((result) => {
        // TODO: Something with result

        PortfolioStore.currentPortfolioAssets.push(result.data);
      }));
  }

  @action.bound
  createAssetAllocation() {
    const usedExchange = this.selectedExchangeAssetAllocation !== '' ?
      this.selectedExchangeAssetAllocation :
      'manually added';

    const newAssetAllocation = {
      selectedExchange: usedExchange,
      selectedDate: this.assetAllocationSelectedDate,
      fromCurrency: this.selectedCurrencyFromAssetAllocation,
      fromAmount: this.assetAllocationFromAmount,
      toCurrency: this.selectedCurrencyToAssetAllocation,
      toAmount: this.assetAllocationToAmount,
      feeCurrency: this.selectedCurrencyForTransactionFee,
      feeAmount: this.assetAllocationFee,
    };

    console.log(newAssetAllocation);
  }

  @action.bound
  resetAsset() {
    this.selectedCurrencyBasicAsset = '';
    this.assetInputValue = '';
    this.selectedExchangeBasicInput = '';
  }

  @action.bound
  resetAssetAllocation() {
    this.selectedExchangeAssetAllocation = '';
    this.assetAllocationSelectedDate = '';
    this.assetAllocationFromAmount = '';
    this.assetAllocationToAmount = '';
    this.assetAllocationFee = '';
    this.selectedCurrencyBasicAsset = '';
    this.selectedCurrencyFromAssetAllocation = '';
    this.selectedCurrencyToAssetAllocation = '';
    this.selectedCurrencyForTransactionFee = '';
    this.selectedCurrencyIdFromAssetAllocation = '';
  }
}

export default new AssetStore();
