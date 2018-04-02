import { observable, action, computed } from 'mobx';
import requester from '../services/requester';


class MarketStore {
  @observable
  marketSummaries;

  @observable
  baseCurrencies;

  @observable
  baseCurrencyInUSD;

  @observable
  selectedBaseCurrency;

  constructor() {
    this.marketSummaries = [];
    this.baseCurrencies = [];
    this.selectedBaseCurrency = null;

    // Setups the database. This request gives the backend what
    // currencies to get from internet, writes them to database.
    // After that, fetches information from  database.
    if (this.baseCurrencies[0] === undefined) {
      requester.Market.getBaseTickers({
        currencies: 'XXBTZUSD,XXBTZEUR,XXBTZJPY,XETHXXBT'
      }).then(() => this.getBaseCurrencies())
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

  @action
  getBaseCurrencies() {
    requester.Market.getBaseCurrencies()
      .then((response) => {
        this.baseCurrencies = response.data;
        console.log(response.data)

        // takes USD as separate currency
        this.baseCurrencies.forEach((currency) => {
          if (currency.pair === 'USD') {
            this.baseCurrencyInUSD = currency;
          }
        });

        this.baseCurrencies.push({ pair: 'BTC', last: 1 });
      })
      .catch(this.onError);
  }

  @action
  selectBaseCurrency(index) {
    this.selectedBaseCurrency = this.baseCurrencies[index];
    console.log(this.selectedBaseCurrency);
  }

  @action.bound
  resetMarket() {
    this.selectedBaseCurrency = null;
  }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  onError(err) {
    console.log(err);
  }
}

export default new MarketStore();
