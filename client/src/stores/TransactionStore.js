// @flow
import { observable, action, computed } from 'mobx';
import requester from '../services/requester';

import PortfolioStore from './PortfolioStore';
import NotificationStore from './NotificationStore';

class TransactionStore {
  @observable transactions;

  constructor() {
    this.transactions = [];
  }

  @action.bound
  getTransactions() {
    requester.Transaction.getAllTransactions(PortfolioStore.selectedPortfolioId)
      .then(action((result: object) => {
        this.transactions = result.data;
      }))
      .catch(action((err: object) => new Error(err)));
  }

  @computed
  get numOfShares() {
    if (this.transactions.length && this.transactions.length > 0) {
      return (this.transactions[this.transactions.length - 1].numSharesAfter);
    }
    return 0;
  }

  @computed
  get sharePrice() {
    if (this.transactions.length && this.transactions.length > 0) {
      return (this.transactions[this.transactions.length - 1].currentSharePriceUSD);
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
