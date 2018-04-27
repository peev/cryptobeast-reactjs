import { observable, action, computed } from 'mobx';
import requester from '../services/requester';

import PortfolioStore from './PortfolioStore';


class MarketStore {
  @observable marketSummaries;
  @observable baseCurrencies;
  @observable allCurrencies;
  @observable allTickers;
  @observable baseCurrencyInUSD;
  @observable selectedBaseCurrency;
  @observable selectedExchangeBasicInput;
  @observable selectedExchangeCreateAccount;
  @observable selectedExchangeAssetAllocation;
  @observable selectedCurrencyBasicAsset;
  @observable selectedCurrencyFromAssetAllocation;
  @observable selectedCurrencyToAssetAllocation;
  @observable assetInputValue;
  @observable selectedDate;

  constructor() {
    this.marketSummaries = {};
    this.baseCurrencies = [];
    this.allCurrencies = [];
    this.allTickers = [];
    this.baseCurrencyInUSD = null;
    this.selectedBaseCurrency = null;
    this.selectedExchangeBasicInput = '';
    this.selectedExchangeCreateAccount = '';
    this.selectedExchangeAssetAllocation = '';
    this.selectedCurrencyBasicAsset = '';
    this.selectedCurrencyFromAssetAllocation = '';
    this.selectedCurrencyToAssetAllocation = '';
    this.assetInputValue = '';
    this.selectedDate = '';
  }

  init() {
    // Setups the database. This request gives the back-end what
    // currencies to get from internet, writes them to database.
    // After that, fetches information from  database.
    requester.Market.getBaseTickers({
      currencies: 'XXBTZUSD,XXBTZEUR,XXBTZJPY,XETHXXBT',
    })
      .then(() => this.getBaseCurrencies())
      .catch(err => console.log(err));

    // gets all currencies(name representation) from api and sync them into database
    // and then calls them back
    requester.Market.syncCurrencies()
      .then(() => this.getAllCurrencies())
      .catch(err => console.log(err));

    // gets all the tickers(name pairs, equivalent) saved in database
    requester.Market.getAllTickers()
      .then(action(result => this.allTickers = result.data))
      .catch(err => console.log(err));

    // get the summary to the market for the past 24h
    requester.Market.getSummaries()
      .then(this.convertMarketSummaries)
      .catch(err => console.log(err));
  }

  @action.bound
  getBaseCurrencies() {
    requester.Market.getBaseCurrencies()
      .then(action((response) => {
        this.baseCurrencies = response.data;

        // takes USD as separate currency
        this.baseCurrencies.forEach((currency) => {
          if (currency.pair === 'USD') {
            this.baseCurrencyInUSD = currency;
          }
        });
        this.baseCurrencies.push({ pair: 'BTC', last: 1 });
      }))
      .catch(err => console.log(err));
  }

  @action.bound
  getAllCurrencies() {
    requester.Market.getAllCurrencies()
      .then(action((response) => {
        this.allCurrencies = response.data.map((el) => {
          return {
            value: el.currency,
            label: `${el.currencyLong} [${el.currency}]`,
            // label: el.currency,
          };
        });
      }))
      .catch(err => console.log(err));
  }

  @action
  getSyncedSummaries() {
    requester.Market.getSyncedSummaries()
      .then(this.convertMarketSummaries)
      .catch(err => console.log(err));
  }

  @action.bound
  convertMarketSummaries(response) {
    const result = {};
    // eslint-disable-next-line no-return-assign
    response.data.forEach(el => result[el.MarketName] = el);
    this.marketSummaries = result;
  }

  @action.bound
  selectBaseCurrency(index) {
    this.selectedBaseCurrency = this.baseCurrencies[index];
  }
  // start: select from all currencies
  @action.bound
  selectCurrencyBasicAsset(value) {
    this.selectedCurrencyBasicAsset = value;
  }

  @action.bound
  selectCurrencyFromAssetAllocation(value) {
    this.selectedCurrencyFromAssetAllocation = value;
  }

  @action.bound
  selectCurrencyToAssetAllocation(value) {
    this.selectedCurrencyToAssetAllocation = value;
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

  @action.bound
  resetMarket() {
    this.selectedBaseCurrency = null;
  }

  @action
  setBasicAssetInputValue(value) {
    if (value < 0) {
      return;
    }

    this.assetInputValue = value;
  }

  @action
  setAssetAllocationValue(type, value) {
    this[type] = value;
    console.log(this[type])
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

    let selectedExchangeOrigin;
    if (this.selectedExchangeBasicInput !== '') {
      selectedExchangeOrigin = this.selectedExchangeBasicInput;
    } else {
      selectedExchangeOrigin = 'Manually Added';
    }

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

  @action
  createAssetAllocation() {
    const newAssetAllocation = {
      selectedExchange: this.selectedExchangeAssetAllocation,
      selectedDate: '',
      fromCurrency: this.selectedCurrencyFromAssetAllocation,
      fromCurrencyAmount: '',
      toCurrency: this.selectedCurrencyToAssetAllocation,
      toCurrencyAmount: '',
    }

    console.log(newAssetAllocation);
  }

  @action.bound
  resetAsset() {
    this.selectedCurrencyBasicAsset = '';
    this.assetInputValue = '';
    this.selectedExchangeBasicInput = '';
    this.selectedExchangeAssetAllocation = '';
  }
}

export default new MarketStore();
