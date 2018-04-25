import { observable, action, reaction } from 'mobx';
import userApi from '../services/user';

import PortfolioStore from './PortfolioStore';

class UserStore {
  @observable data = {}

  constructor() {
    this.getUserData();

    reaction(
      () => this.data.selectedPortfolio,
      portfolioId => PortfolioStore.selectPortfolio(portfolioId)
    );
  }

  getUserData() {
    userApi.getUserData().then((data) => {
      this.setData(data);
    });
  }

  saveData() {
    userApi.setUserData(this.data).then((data) => {
      this.setData(data);
    });
  }

  @action
  setData(data) {
    this.data = data;
  }

  @action
  setPortfolio(portfolioId) {
    this.data.selectedPortfolio = portfolioId;
    this.saveData();
  }
}

export default new UserStore();
