import { observable, action, computed } from 'mobx';
import requester from '../services/requester';

class Currencies {
  @observable currencies;

  constructor() {
    this.currencies = [];
    this.currenciesHistory = [];
  }

  init() {
    this.getCurrencies();
  }

  @action.bound
  getCurrencies() {
    requester.Currency.getAllCurrencies()
      .then(action((result) => {
        this.currencies = result.data;
      }));
  }

  @computed
  get currenciesTokenNameAndSymbol() {
    if (this.currencies.length && this.currencies.length > 0) {
      return this.currencies.map(el => el.tokenName);
    }
    return [];
  }
}

export default new Currencies();
