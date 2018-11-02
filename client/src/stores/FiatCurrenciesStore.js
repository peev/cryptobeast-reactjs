import { observable, action, computed, onBecomeObserved } from 'mobx';
import requester from '../services/requester';

class FiatCurrencies {
  @observable fiatCurrencies;
  @observable fiatCurrenciesHistory;

  constructor() {
    this.fiatCurrencies = [];
    this.fiatCurrenciesHistory = [];

    onBecomeObserved(this, 'fiatCurrencies', this.getFiatCurrencies);
    onBecomeObserved(this, 'fiatCurrenciesHistory', this.fiatCurrenciesHistory);
  }

  init() {
    this.getFiatCurrencies();
  }

  @action.bound
  getFiatCurrencies() {
    requester.FiatCurrencies.getFiatCurrencies()
      .then(action((result) => {
        this.fiatCurrencies = result.data;
      }));
  }

  // Array of ids of the currencies we want to fetch their history
  @action.bound
  getFiatCurrenciesHistory(currencies) {
    requester.FiatCurrencies.getFiatCurrenciesHistory(currencies)
      .then(action((result) => {
        this.fiatCurrenciesHistory = result.data;
      }));
  }
}

export default new FiatCurrencies();
