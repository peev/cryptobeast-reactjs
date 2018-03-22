import { observable, action } from 'mobx';
import requester from '../services/requester';


class MarketStore {
  @observable
  marketSummaries = [];

  @action
  getMarketSummaries() {
    requester.Market.getSummaries()
      .then((response) => {
        this.marketSummaries = response.data;
      })
      .catch(this.onError);
  }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  onError(err) {
    console.log(err);
  }
}

export default new MarketStore();
