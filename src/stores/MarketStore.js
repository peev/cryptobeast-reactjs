import { observable, action } from 'mobx';
import requester from '../services/requester';


class MarketStore {
  @observable
  marketSummaries;

  @observable
  baseCurrencies;

  @observable
  allCurrencies;

  @observable
  baseCurrencyInUSD;

  @observable
  selectedBaseCurrency;

  @observable
  selectedАllCurrency;

  @observable
  selectedExchange;

  @observable
  assetInputValue;

  constructor() {
    this.marketSummaries = [];
    this.baseCurrencies = [];
    this.allCurrencies = [];
    this.selectedBaseCurrency = null;

    // Setups the database. This request gives the backend what
    // currencies to get from internet, writes them to database.
    // After that, fetches information from  database.
    if (this.baseCurrencies.length === 0) {
      requester.Market.getBaseTickers({
        currencies: 'XXBTZUSD,XXBTZEUR,XXBTZJPY,XETHXXBT',
      })
        .then(() => this.getBaseCurrencies())
        .catch(this.onError);
    }

    if (this.allCurrencies.length === 0) {
      requester.Market.syncCurrencies()
        .then(() => this.getAllCurrencies())
        .catch(this.onError);
    }
  }

  @action
  getMarketSummaries() {
    requester.Market.getSummaries()
      .then((response) => {
        this.marketSummaries = response.data;
      })
      .catch(this.onError);
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
      .catch(this.onError);
    console.log(this.baseCurrencies);
  }

  @action.bound
  getAllCurrencies() {
    requester.Market.getAllCurrencies()
      .then(action((response) => {
        this.allCurrencies = response.data;
      }))
      .catch(this.onError);
  }

  @action
  selectBaseCurrency(index) {
    this.selectedBaseCurrency = this.baseCurrencies[index];
  }

  @action
  selectCurrencyFromAllCurrencies(index) {
    this.selectedCurrency = this.allCurrencies[index];
  }

  @action
  selectExchange(value) {
    this.selectedExchange = value;
  }

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
  createBasicAsset(id) {
    let newBasicAsset;

    // if there is no Exchange selected, it's labeled as manually
    if (this.selectedExchange) {
      newBasicAsset = {
        currency: this.selectedCurrency.currency,
        balance: this.assetInputValue,
        origin: this.selectedExchange,
        portfolioId: id,
      };
    } else {
      newBasicAsset = {
        currency: this.selectedCurrency.currency,
        balance: this.assetInputValue,
        origin: 'Manually Added',
        portfolioId: id,
      };
    }

    console.log(newBasicAsset);
    requester.Asset.add(newBasicAsset)
      .then((result) => {
        console.log(result);

        // reset values after save
        this.selectedCurrency = null;
        this.assetInputValue = null;
        this.selectedExchange = null;
      });
  }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  onError(err) {
    console.log(err);
  }
}

export default new MarketStore();
