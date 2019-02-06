// @flow
import { observable, action } from 'mobx';
import PortfolioStore from './PortfolioStore';
import requester from '../services/requester';

class Allocations {
  @observable allocations;

  constructor() {
    this.allocations = [];
  }

  @action.bound
  getAllocations() {
    requester.Allocations.getAllocations(PortfolioStore.selectedPortfolioId)
      .then(action((result: object) => {
        this.allocations = result.data;
      }));
  }
}

export default new Allocations();
