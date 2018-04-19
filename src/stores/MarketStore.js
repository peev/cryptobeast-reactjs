import { observable, action, computed } from 'mobx';
import requester from '../services/requester';


class MarketStore {
  @observable marketSummaries;
  @observable baseCurrencies;
  @observable allCurrencies;
  @observable allTickers;
  @observable baseCurrencyInUSD;
  @observable selectedBaseCurrency;
  @observable selectedАllCurrency;
  @observable selectedExchange;
  @observable selectedCurrency;
  @observable assetInputValue;

  constructor() {
    this.marketSummaries = [];
    this.baseCurrencies = [];
    this.allCurrencies = [];
    this.allTickers = [];
    this.selectedBaseCurrency = null;
    this.selectedExchange = '';
    this.selectedCurrency = '';
    this.assetInputValue = '';

    // Setups the database. This request gives the back-end what
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

    if (this.allTickers.length === 0) {
      requester.Market.getAllTickers()
        .then(this.getAllTickers)
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
      .catch(this.onError);
  }

  @action.bound
  getAllTickers(result) {
    this.allTickers = result.data;
  }

  @action
  selectBaseCurrency(index) {
    this.selectedBaseCurrency = this.baseCurrencies[index];
  }

  @action
  selectCurrencyFromAllCurrencies(value) {
    this.selectedCurrency = value;
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
    if (this.selectedCurrency === null || this.selectedCurrency === '') {
      return;
    }

    const parsedAssetInputValue = parseInt(this.assetInputValue, 10);
    if (!Number.isInteger(parsedAssetInputValue) || isNaN(parsedAssetInputValue)) {
      return;
    }

    let selectedExchangeOrigin;
    if (this.selectedExchange !== '') {
      selectedExchangeOrigin = this.selectedExchange;
    } else {
      selectedExchangeOrigin = 'Manually Added';
    }

    const newBasicAsset = {
      currency: this.selectedCurrency,
      balance: parsedAssetInputValue,
      origin: selectedExchangeOrigin,
      portfolioId: id,
    };

    requester.Asset.add(newBasicAsset)
      .then(action((result) => {
        // TODO: Something with result
        this.resetAsset();
      }));
  }

  @action.bound
  resetAsset() {
    this.selectedCurrency = '';
    this.assetInputValue = '';
    this.selectedExchange = '';
  }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  onError(err) {
    console.log(err);
  }
}

export default new MarketStore();
