// @flow
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
      .then(action((result: object) => {
        this.allocations = result.data;
      }));
  }

  @computed
  get allocationsBreakdownETH() {
    if (PortfolioStore.selectedPortfolio && this.allocations.length > 0) {
      return this.allocations
        .map((el: object) =>
          ([
            Number(new Date(el.timestamp).getTime()),
            Object.keys(el.balance).reduce((previous: number, key: number) =>
              BigNumberService.toNumber(BigNumberService.gweiToEth(BigNumberService.sum(previous, el.balance[key].balance))), 0),
          ]));
    }
    return [];
  }

  get allocationsBreakdownUSD() {
    if (PortfolioStore.selectedPortfolio && this.allocations.length > 0) {
      return this.allocations
        .map((el: object) =>
          ([
            Number(new Date(el.timestamp).getTime()),
            Object.keys(el.balance).reduce((previous: number, key: number) =>
              Number(BigNumberService
                .toFixedParam(BigNumberService
                  .gweiToEth(BigNumberService
                    .product(BigNumberService
                      .sum(previous, el.balance[key].balance), 200)), 2))),
          ]));
    }
    return [];
  }
}

export default new Allocations();
