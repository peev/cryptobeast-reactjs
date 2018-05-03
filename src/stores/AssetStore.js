import { observable, action, computed } from 'mobx';
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
    this.selectedCurrencyToAssetAllocation = '';
    this.selectedCurrencyForTransactionFee = 'BTC';
    this.assetInputValue = '';
    this.assetAllocationSelectedDate = '';
    this.assetAllocationFromAmount = '';
    this.assetAllocationToAmount = '';
    this.assetAllocationFee = '0';
  }

  // start: select from all currencies
  @action.bound
  selectCurrencyBasicAsset(input) {
    this.selectedCurrencyBasicAsset = input;
  }

  @action
  selectCurrencyFromAssetAllocation(id) {
    PortfolioStore.currentPortfolioAssets.forEach((el) => {
      if (el.id === id) {
        this.selectedCurrencyFromAssetAllocation = el;
      }
    });
  }

  @action.bound
  selectCurrencyToAssetAllocation(value) {
    this.selectedCurrencyToAssetAllocation = value;

    /**
     * This checks if current available asset can be converted to desired output asset.
     * If soo, suggest quantity to convert for.
     * currentFromQuantity => current BTC or other crypto currencies quantity for available asset
     * currentToQuantity => current BTC or other crypto currencies quantity for output asset
     */
    if (this.selectedCurrencyToAssetAllocation !== '') {
      const currentFromQuantity = this.selectCurrencyFromMarketSummaries(this.selectedCurrencyFromAssetAllocation.currency);
      const currentToQuantity = this.selectCurrencyFromMarketSummaries(this.selectedCurrencyToAssetAllocation);

      switch (currentToQuantity) {
        case 0:
        case 1:
          this.assetAllocationToAmount = this.assetAllocationFromAmount * currentFromQuantity;
          break;
        default:
          this.assetAllocationToAmount = (this.assetAllocationFromAmount * currentFromQuantity) / currentToQuantity;
          break;
      }
    }
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

    if (type === 'assetAllocationFromAmount' &&
      this.selectedCurrencyFromAssetAllocation !== '') {
      if (parseInt(value, 10) > this.selectedCurrencyFromAssetAllocation.balance) {
        NotificationStore.addMessage('errorMessages', 'Not enough balance');
        return;
      }
    }

    if (type === 'assetAllocationToAmount' &&
      this.selectedCurrencyFromAssetAllocation !== '' &&
      this.selectedCurrencyToAssetAllocation !== '') {
      if (this.assetAllocationFromAmount === '') {
        NotificationStore.addMessage('errorMessages', 'Add amount to covert from');
        return;
      }
    }

    if (type === 'assetAllocationFee' &&
      this.assetAllocationToAmount !== '') {
      if (this.assetAllocationToAmount < value) {
        NotificationStore.addMessage('errorMessages', 'Fee amount cannot be more then the converted asset.');
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
      fromCurrency: this.selectedCurrencyFromAssetAllocation.currency,
      portfolioId: PortfolioStore.selectedPortfolioId,
      fromAmount: this.assetAllocationFromAmount,
      toCurrency: this.selectedCurrencyToAssetAllocation,
      toAmount: this.assetAllocationToAmount,
      feeCurrency: this.selectedCurrencyForTransactionFee,
      feeAmount: this.assetAllocationFee,
    };

    // NOTE: conversion request has update, create, even delete.
    // That why it returns the updated assets for the current portfolio
    requester.Asset.allocate(newAssetAllocation)
      .then(action((result) => {
        console.log(result);
        PortfolioStore.currentPortfolioAssets = result.data;
      }));

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
    this.assetAllocationFee = '0';
    this.selectedCurrencyBasicAsset = '';
    this.selectedCurrencyFromAssetAllocation = '';
    this.selectedCurrencyToAssetAllocation = '';
    this.selectedCurrencyForTransactionFee = 'BTC';
    this.selectedCurrencyIdFromAssetAllocation = '';
  }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  selectCurrencyFromMarketSummaries(currencyName) {
    let foundCurrency;
    switch (currencyName) {
      case 'BTC':
        foundCurrency = 1;
        break;
      case 'ETH':
        foundCurrency = MarketStore.marketSummaries[`ETH-${currencyName}`] ?
          MarketStore.marketSummaries[`ETH-${currencyName}`].Last :
          0;
        break;
      case 'USDT':
        foundCurrency = MarketStore.marketSummaries[`USDT-${currencyName}`] ?
          MarketStore.marketSummaries[`USDT-${currencyName}`].Last :
          0;
        break;
      default:
        console.log(MarketStore.marketSummaries[`BTC-${currencyName}`])
        // foundCurrency = MarketStore.marketSummaries[`BTC-${currencyName}`].Last;
        foundCurrency = MarketStore.marketSummaries[`BTC-${currencyName}`] ?
          MarketStore.marketSummaries[`BTC-${currencyName}`].Last :
          0;
        break;
    }

    return foundCurrency;
  }
}

export default new AssetStore();
