/* eslint-disable class-methods-use-this */
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

  getEndOfDay(timestamp: number) {
    const firstDate = new Date(timestamp);
    firstDate.setHours(23);
    firstDate.setMinutes(59);
    firstDate.setSeconds(59);
    return new Date(firstDate.toString()).getTime();
  }

  getStartOfDay(timestamp: number) {
    const firstDate = new Date(timestamp);
    firstDate.setHours(0);
    firstDate.setMinutes(0);
    firstDate.setSeconds(0);
    return new Date(firstDate.toString()).getTime();
  }

  calculateDays(begin: number, end: number) {
    const dates = [];
    for (let i = begin; i <= end; i += (24 * 60 * 60 * 1000)) {
      dates.push(i);
    }
    return dates;
  }

  getLastBalance(start: number, end: number) {
    const allocations = this.allocations.filter((allocation: object) =>
      new Date(allocation.timestamp.toString()).getTime() >= start && new Date(allocation.timestamp.toString()).getTime() <= end);
    return (allocations[allocations.length - 1] !== undefined) ? allocations[allocations.length - 1].balance : undefined;
  }

  @computed
  get portfolioValue() {
    if (this.allocations.length && this.allocations.length > 0) {
      const result = [];
      const today = new Date().getTime();
      const yesterday = today - (24 * 3600);
      const begin = new Date((this.allocations[0].timestamp).toString()).getTime();
      const days = this.calculateDays(this.getEndOfDay(begin), this.getEndOfDay(yesterday));
      days.forEach((day: number, index: number) => {
        const start = this.getStartOfDay(day);
        result.push(this.getLastBalance(start, day) !== undefined ? this.getLastBalance(start, day) : result[index - 1]);
      });
      return result;
    }
    return [];
  }

  @computed
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
