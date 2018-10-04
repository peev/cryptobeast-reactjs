// @flow
/* eslint no-console: 0 */
import { observable, action, computed } from 'mobx';
import requester from '../services/requester';

class MarketStore {
  @observable marketSummaries;
  @observable marketPriceHistory;
  @observable baseCurrencies;
  @observable allCurrencies;
  @observable allTickers;
  @observable baseCurrencyInUSD;
  @observable selectedBaseCurrency;
  @observable profitLoss;
  @observable liquidity;
  @observable correlationMatrix;

  constructor() {
    this.marketSummaries = {};
    this.marketPriceHistory = {};
    this.baseCurrencies = [];
    this.allCurrencies = [];
    this.allTickers = [];
    this.baseCurrencyInUSD = null;
    this.selectedBaseCurrency = null;
    this.profitLoss = {};
    this.liquidity = [];
    this.correlationMatrix = [];
  }

  init() {
    // Setups the database. This request gives the back-end what
    // currencies to get from internet, writes them to database.
    // After that, fetches information from  database.
    requester.Market.getBaseTickers({
      currencies: 'XXBTZUSD,XXBTZEUR,XXBTZJPY,XETHXXBT',
    })
      .then(() => this.getBaseCurrencies())
      .catch((err: object) => console.log(err));

    // gets all currencies(name representation) from api and sync them into database
    // and then calls them back
    requester.Market.syncCurrencies()
      .then(() => this.getAllCurrencies())
      .catch((err: object) => console.log(err));

    // gets all the tickers(name pairs, equivalent) saved in database
    requester.Market.getAllTickers()
      .then(action(result => this.allTickers = result.data)) // eslint-disable-line
      .catch((err: object) => console.log(err));

    // get the summary to the market for the past 24h
    requester.Market.getSummaries()
      .then(this.convertMarketSummaries)
      .catch((err: object) => console.log(err));

    // get market price history from database (Coin Market Cap)
    requester.Market.getMarketPriceHistory()
      .then(this.convertMarketPriceHistory)
      .catch((err: object) => console.log(err));
    
    // get profit and loss history from database (Coin Market Cap)
    requester.Market.getProfitAndLossHistory()
      .then(this.getCurrenciesHistory)
      .catch((err: object) => console.log(err));
    
    // get liquidity history from database (Coin Market Cap)
    requester.Market.getLiquidityHistory()
      .then(this.getLiquidityHistory)
      .catch((err: object) => console.log(err));
    
    // get correlation matrix history from database (Coin Market Cap)
    requester.Market.getCorrelationMatrixHistory()
      .then(this.getCorrelationMatrixHistory)
      .catch((err: object) => console.log(err));
  }

  @computed
  get allCurrenciesCombined() {
    const nonRepeatingBaseCurrencies = this.baseCurrencies
      .map((currency: object) => ({ value: currency.pair, label: currency.pair }))
      .filter((x: object) => x.value !== 'BTC' && x.value !== 'ETH' && x.value !== 'USD');

    const clonedAllCurrencies = Array.from(this.allCurrencies);
    nonRepeatingBaseCurrencies.forEach((element: object) => clonedAllCurrencies.push(element));
    return clonedAllCurrencies;
  }

  @action.bound
  getCurrenciesHistory(response: object) {
    let builder = {};
    response.data.forEach((data: object) => {
      if(!builder[data.Symbol]) {
        builder[data.Symbol] = [];
      }
      builder[data.Symbol].push(data);
    });
    builder.ready = true;
    this.profitLoss = builder;
  }

  @action.bound
  getCorrelationMatrixHistory(response: object) {
    this.correlationMatrix = response.data;
  }

  @action.bound
  getLiquidityHistory(response: object) {
    this.liquidity = response.data;
  }

  @action.bound
  getBaseCurrencies() {
    requester.Market.getBaseCurrencies()
      .then(action((response: object) => {
        this.baseCurrencies = response.data;

        // takes USD as separate currency
        this.baseCurrencies.forEach((currency: object) => {
          if (currency.pair === 'USD') {
            this.baseCurrencyInUSD = currency;
          }
        });
        this.baseCurrencies.push({ pair: 'BTC', last: 1 });
      }))
      .catch((err: object) => console.log(err));
  }

  @action.bound
  getAllCurrencies() {
    requester.Market.getAllCurrencies()
      .then(action((response: object) => {
        this.allCurrencies = response.data.map((el: oject) => ({
          value: el.currency,
          label: `${el.currencyLong} [${el.currency}]`,
          // label: el.currency,
        }));
      }))
      .catch((err: object) => console.log(err));
  }

  @action
  getSyncedSummaries() {
    requester.Market.getSyncedSummaries()
      .then(this.convertMarketSummaries)
      .catch((err: object) => console.log(err));
  }

  @action
  syncMarketPriceHistory() {
    // syncs the price history to the market for the past 1h, 24h and 7d
    // convertCurrency is given, so user can chose in what base currency
    // information will be displayed
    requester.Market.syncMarketPriceHistory({ convertCurrency: 'BTC' })
      .then(this.convertMarketPriceHistory)
      .catch((err: object) => console.log(err));
  }

  @action.bound
  convertMarketSummaries(response: object) {
    const result = {};
    // eslint-disable-next-line no-return-assign
    response.data.forEach((el: object) => result[el.MarketName] = el);
    this.marketSummaries = result;
  }

  @action.bound
  convertMarketPriceHistory(response: object) {
    const result = {};
    // eslint-disable-next-line no-return-assign
    response.data.forEach((el: object) => result[el.currency] = el);
    this.marketPriceHistory = result;
  }

  @action.bound
  selectBaseCurrency(currency: object) {
    if (currency !== '' && this.baseCurrencies.length > 0) {
      [this.selectedBaseCurrency] = this.baseCurrencies.filter((item: object) => item.pair === currency);
    } else {
      this.resetMarket();
    }
  }

  @action.bound
  resetMarket() {
    this.selectedBaseCurrency = null;
  }
}

export default new MarketStore();
