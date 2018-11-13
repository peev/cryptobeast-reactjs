import { observable, action, computed, onBecomeObserved } from 'mobx';
import PortfolioStore from './PortfolioStore';
import requester from '../services/requester';
import BigNumberService from '../services/BigNumber';

class Allocations {
  @observable allocations;

  constructor() {
    this.allocations = [];

    onBecomeObserved(this, 'allocations', this.getAllocations);
  }

  @action.bound
  getAllocations() {
    requester.Allocations.getAllocations(PortfolioStore.selectedPortfolioId)
      .then(action((result) => {
        this.allocations = result.data;
      }));
  }

  @computed
  get allocationsBreakdown() {
    if (PortfolioStore.selectedPortfolio && this.allocations.length > 0) {
      console.log('------------------------------------');
      console.log(this.allocations
        .map(el => [{
          datetime: Number(new Date(el.timestamp).getTime()),
          balance: Object.keys(this.allocations).reduce((previous, key) => previous + this.allocations[key].balance, 0),
        }]));
      console.log('------------------------------------');
      return this.allocations
        .map(el => [{
          datetime: Number(new Date(el.timestamp).getTime()),
          balance: Object.keys(this.allocations).reduce((previous, key) => previous + this.allocations[key].balance, 0),
        }]);
    }
    return [];
  }
}

export default new Allocations();
