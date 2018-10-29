import { observable, action, computed, onBecomeObserved } from 'mobx';
import requester from '../services/requester';

class Currencies {
  @observable currencies;
  @observable currenciesHistory;

  constructor() {
    this.currencies = [];
    this.currenciesHistory = [];

    onBecomeObserved(this, 'currencies', this.getCurrencies);
    onBecomeObserved(this, 'currenciesHistory', this.currenciesHistory);
  }

  @action.bound
  getCurrencies() {
    requester.Currencies.getCurrencies()
      .then(action((result) => {
        this.currencies = result.data;
      }));
  }
}
// Array of ids of the currencies we want to fetch their history 
@action.bound
getCurrenciesHistory(currencies) {
  requester.Currencies.getCurrenciesHistory(currencies)
    .then(action((result) => {
      this.currenciesHistory = result.data;
    }));
}
}

export default new Currencies();
