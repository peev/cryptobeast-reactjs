// @flow
import { observable, action, computed, onBecomeObserved } from 'mobx';
import requester from '../services/requester';

import PortfolioStore from './PortfolioStore';
import BigNumberService from '../services/BigNumber';
import NotificationStore from './NotificationStore';


class TransactionStore {
  @observable transactions;

  constructor() {
    this.transactions = [];

    onBecomeObserved(this, 'transactions', this.getTransactions);
  }

  @action.bound
  getTransactions() {
    requester.Transaction.getAllTransactions(PortfolioStore.selectedPortfolioId)
      .then(action((result: object) => {
        this.transactions = result.data;
      }));
  }

  @computed
  get numOfShares() {
    if (this.transactions.length && this.transactions.length > 0) {
      return BigNumberService.toFixedParam((this.transactions[this.transactions.length - 1].numSharesAfter), 2);
    }
    return 0;
  }

  @computed
  get sharePrice() {
    if (this.transactions.length && this.transactions.length > 0) {
      return BigNumberService.toFixedParam((this.transactions[this.transactions.length - 1].currentSharePriceUSD), 2);
    }
    return 0;
  }

  @action.bound
  setInvestor(transactionId: number, investorId: number) {
    requester.Transaction.setInvestor(transactionId, investorId)
      .then(action(() => {
        NotificationStore.addMessage('successMessages', 'Investor assigned successfully!');
        this.getTransactions();
      }))
      .catch(() => {
        NotificationStore.addMessage('errorMessages', 'Error occurred, please try again.');
      });
  }
}

export default new TransactionStore();
