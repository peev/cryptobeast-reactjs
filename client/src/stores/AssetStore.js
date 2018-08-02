// @flow
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
    this.selectedCurrencyForTransactionFee = '';
    this.assetInputValue = '';
    this.assetAllocationSelectedDate = '';
    this.assetAllocationFromAmount = '';
    this.assetAllocationToAmount = '';
    this.assetAllocationFee = '';
  }

  @computed
  get currentPortfolioAssetsToShow() {
    const selectedExchange = this.selectedExchangeAssetAllocation === ''
      ? 'Manually Added'
      : this.selectedExchangeAssetAllocation;

    const filteredAssets = PortfolioStore.currentPortfolioAssets
      .filter((el: Object) => el.origin === selectedExchange)
      .map((el: Object) => ({ value: el.id, label: el.currency }));

    return filteredAssets;
  }

  // start: select from all currencies
  @action.bound
  selectCurrencyBasicAsset(input: string) {
    this.selectedCurrencyBasicAsset = input;
  }

  @action
  selectCurrencyFromAssetAllocation(id: string) {
    PortfolioStore.currentPortfolioAssets.forEach((asset: object) => {
      if (asset.id === id) {
        this.selectedCurrencyFromAssetAllocation = asset;
      }
    });

    // if current value is bigger then available balance
    if (this.selectedCurrencyFromAssetAllocation !== ''
      && this.selectedCurrencyToAssetAllocation !== ''
      && parseInt(this.assetAllocationFromAmount, 10) > this.selectedCurrencyFromAssetAllocation.balance) {
      this.assetAllocationFromAmount = this.selectedCurrencyFromAssetAllocation.balance;
    }

    if (this.selectedCurrencyFromAssetAllocation !== '' && this.selectedCurrencyToAssetAllocation !== '') {
      this.setSuggestionValueForAssetAllocationToAmount();
    }
  }

  @action.bound
  selectCurrencyToAssetAllocation(value: string) {
    this.selectedCurrencyToAssetAllocation = value;

    if (this.selectedCurrencyToAssetAllocation !== '') {
      this.setSuggestionValueForAssetAllocationToAmount();
    }
  }

  @action.bound
  selectCurrencyForTransactionFee(value: string) {
    this.selectedCurrencyForTransactionFee = value;
  }
  // end: select from all currencies

  // start: select exchange
  @action.bound
  selectExchangeBasicInput(value: string) {
    this.selectedExchangeBasicInput = value;
  }

  @action.bound
  selectExchangeAssetAllocation(value: string) {
    this.selectedExchangeAssetAllocation = value;
  }

  @action.bound
  selectExchangeCreateAccount(value: string) {
    this.selectedExchangeCreateAccount = value;
  }
  // end: select exchange

  @action
  setBasicAssetInputValue(value: string) {
    this.assetInputValue = value;
  }

  @action.bound
  setAssetAllocationValue(type: string, value: string) {
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

  @action
  createBasicAsset(id: string) {
    if (this.selectedCurrencyBasicAsset === null || this.selectedCurrencyBasicAsset === '') {
      return;
    }

    const selectedExchangeOrigin = this.selectedExchangeBasicInput !== '' ?
      this.selectedExchangeBasicInput :
      'Manually Added';

    const existingAsset = PortfolioStore.currentPortfolioAssets
      .find((asset: object) =>
        asset.currency === this.selectedCurrencyBasicAsset &&
        asset.origin === selectedExchangeOrigin &&
        asset.portfolioId === id);
    if (existingAsset) {
      existingAsset.balance += Number(this.assetInputValue);
      requester.Asset.update(existingAsset);
      return;
    }

    const newBasicAsset = {
      currency: this.selectedCurrencyBasicAsset,
      balance: Number(this.assetInputValue),
      origin: selectedExchangeOrigin,
      portfolioId: id,
    };

    requester.Asset.add(newBasicAsset)
      .then(action((result: object) => {
        PortfolioStore.currentPortfolioAssets.push(result.data);
      }));
  }

  @action.bound
  createTradeAssetAllocation() {
    const selectedExchange = this.selectedExchangeAssetAllocation !== ''
      ? this.selectedExchangeAssetAllocation
      : 'Manually Added';
    const today = new Date().toISOString().substring(0, 10);
    const newAssetAllocation = {
      selectedExchange,
      selectedDate: this.assetAllocationSelectedDate || today,
      fromCurrency: this.selectedCurrencyFromAssetAllocation.currency,
      portfolioId: PortfolioStore.selectedPortfolioId,
      fromAmount: this.assetAllocationFromAmount,
      toCurrency: this.selectedCurrencyToAssetAllocation,
      toAmount: `${this.assetAllocationToAmount}`, // NOTE: DON'T TOUCH THIS STRING
      feeCurrency: this.selectedCurrencyForTransactionFee,
      feeAmount: this.assetAllocationFee,
    };

    // NOTE: allocation request has update, create and delete.
    // That why it returns the updated assets for the current portfolio
    return requester.Asset.allocate(newAssetAllocation)
      .then(action((result: object) => {
        PortfolioStore.currentPortfolioAssets = result.data.assets;
        PortfolioStore.createTrade(result.data.fromAsset, result.data.toAsset);

        NotificationStore.addMessage('successMessages', 'Successful asset allocation');

        this.resetAssetAllocation();
      }))
      .catch((error: object) => {
        if (!error.response.data.isSuccessful) {
          NotificationStore.addMessage('errorMessages', 'Error occurred, please try again.');
        }
        // console.log(error.response);
      });
  }

  // @action.bound
  // handleUpdateTradeErrors(trade) {
  //   const oldAssets = [];

  //   const selectedExchange = 'Manually Added';
  //   // const selectedExchange = this.selectedExchangeAssetAllocation !== '' ?
  //   //   this.selectedExchangeAssetAllocation :
  //   //   'Manually Added';
  //   const newAssetAllocation = {
  //     selectedExchange,
  //     selectedDate: this.assetAllocationSelectedDate,
  //     fromCurrency: this.selectedCurrencyFromAssetAllocation.currency,
  //     portfolioId: PortfolioStore.selectedPortfolioId,
  //     fromAmount: this.assetAllocationFromAmount,
  //     toCurrency: this.selectedCurrencyToAssetAllocation,
  //     toAmount: this.assetAllocationToAmount,
  //     feeCurrency: this.selectedCurrencyForTransactionFee,
  //     feeAmount: this.assetAllocationFee,
  //   };
  //   console.log('*** create Asset', newAssetAllocation);

  //   // NOTE: allocation request has update, create and delete.
  //   // That why it returns the updated assets for the current portfolio
  //   return requester.Asset.allocate(newAssetAllocation)
  //     .then(action((result) => {
  //       PortfolioStore.currentPortfolioAssets = result.data.assets;
  //       PortfolioStore.createTrade(result.data.fromAsset, result.data.toAsset);
  //     }))
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // @action.bound
  // updateTradeAssetAllocation(trade) {
  //   console.log(trade);
  //   const oldAssets = [];
  //   // let oldAssets = PortfolioStore.currentPortfolioAssets.map((asset) => (
  //   //   if(asset.id === trade.fromAssetId){
  //   //     asset.balance ===
  //   //   }
  //   // )
  //   const [assetFrom] = PortfolioStore.currentPortfolioAssets.filter(x => x.id === trade.fromAssetId);
  //   const [assetTo] = PortfolioStore.currentPortfolioAssets.filter(x => x.id === trade.toAssetId);
  //   console.log('assetFrom', assetFrom, 'assetTo', assetTo);
  //   // const selectedExchange = 'Manually Added';
  //   // // const selectedExchange = this.selectedExchangeAssetAllocation !== '' ?
  //   // //   this.selectedExchangeAssetAllocation :
  //   // //   'Manually Added';
  //   // const today = new Date().toISOString().substring(0, 10);
  //   // const newAssetAllocation = {
  //   //   selectedExchange,
  //   //   selectedDate: this.assetAllocationSelectedDate || today,
  //   //   fromCurrency: this.selectedCurrencyFromAssetAllocation.currency,
  //   //   portfolioId: PortfolioStore.selectedPortfolioId,
  //   //   fromAmount: this.assetAllocationFromAmount,
  //   //   toCurrency: this.selectedCurrencyToAssetAllocation,
  //   //   toAmount: this.assetAllocationToAmount,
  //   //   feeCurrency: this.selectedCurrencyForTransactionFee,
  //   //   feeAmount: this.assetAllocationFee,
  //   // };
  //   // console.log('*** create Asset', newAssetAllocation);

  //   // // NOTE: allocation request has update, create and delete.
  //   // // That why it returns the updated assets for the current portfolio
  //   // return requester.Asset.allocate(newAssetAllocation)
  //   //   .then(action((result) => {
  //   //     PortfolioStore.currentPortfolioAssets = result.data.assets;
  //   //     PortfolioStore.createTrade(result.data.fromAsset, result.data.toAsset);
  //   //   }))
  //   //   .catch((error) => {
  //   //     console.log(error);
  //   //   });
  // }


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

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  selectCurrencyFromMarketSummaries(currencyName: string) {
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
        foundCurrency = MarketStore.marketSummaries[`BTC-${currencyName}`] ?
          MarketStore.marketSummaries[`BTC-${currencyName}`].Last :
          0;
        break;
    }

    return foundCurrency;
  }

  @action.bound
  resetCurrency() {
    this.selectedCurrencyFromAssetAllocation = '';
  }

  /**
   * This checks if current available asset can be converted to desired output asset.
   * If so, suggest quantity to convert for.
   *
   * currentFromQuantity => current BTC or other crypto currencies quantity for available asset
   * currentToQuantity => current BTC or other crypto currencies quantity for output asset
   */
  @action.bound
  setSuggestionValueForAssetAllocationToAmount() {
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

export default new AssetStore();
