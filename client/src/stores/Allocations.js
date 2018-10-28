import { observable, action, computed, onBecomeObserved } from 'mobx';
import requester from '../services/requester';

class Allocations {
  @observable allocations;

  constructor() {
    this.allocations = [];

    onBecomeObserved(this, 'allocations', this.getAllocations);
  }

  @action.bound
  getAllocations() {
    const searchedHistoryItems = {
      portfolioId: PortfolioStore.selectedPortfolioId
    };

    requester.Allocations.getSharePriceHistory(searchedHistoryItems)
      .then(action((result) => {
        this.allocations = result.data;
      }));
  }
}

export default new Allocations();
