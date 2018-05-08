/* eslint no-console: 0 */
import { observable, action } from 'mobx';
import requester from '../services/requester';


class MarketStore {
  @observable marketSummaries;
  @observable baseCurrencies;
  @observable allCurrencies;
  @observable allTickers;
  @observable baseCurrencyInUSD;
  @observable selectedBaseCurrency;

  constructor() {
    this.marketSummaries = {};
    this.baseCurrencies = [];
    this.allCurrencies = [];
    this.allTickers = [];
    this.baseCurrencyInUSD = null;
    this.selectedBaseCurrency = null;
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
      .then(action(result => this.allTickers = result.data)) // eslint-disable-line
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
        this.allCurrencies = response.data.map(el => ({
          value: el.currency,
          label: `${el.currencyLong} [${el.currency}]`,
          // label: el.currency,
        }));
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

  @action.bound
  resetMarket() {
    this.selectedBaseCurrency = null;
  }
}

export default new MarketStore();