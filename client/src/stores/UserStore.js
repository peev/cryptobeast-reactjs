import { observable, action, reaction } from 'mobx';
import userApi from '../services/user';

import PortfolioStore from './PortfolioStore';
import requester from '../services/requester';

class UserStore {
  @observable data;
  @observable timeValue;
  @observable timeType;

  constructor() {
    this.data = {};
    this.timeValue = '23:59';
    this.timeType = true;

    this.getUserData();

    reaction(
      () => this.data.selectedPortfolio,
      portfolioId => PortfolioStore.selectPortfolio(portfolioId),
    );
  }

  @action
  getUserData() {
    userApi.getUserData().then(action((data) => {
      this.data = data;
    }));
  }

  @action
  saveData() {
    userApi.setUserData(this.data).then(action((data) => {
      this.data = data;
    }));
  }

  @action
  setPortfolio(portfolioId) {
    this.data.selectedPortfolio = portfolioId;
    this.saveData();
  }

  @action.bound
  setTimeType() {
    this.timeType = !this.timeType;

    // resets the time if 'timeType' is 'true'
    if (this.timeType === true && this.timeValue !== '23:59') {
      this.timeValue = '23:59';

      // rest to default value
      this.updateClosingTime();
    }
  }

  @action.bound
  setTimeValue(value) {
    this.timeValue = value;
  }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  updateClosingTime() {
    const newClosingTime = {
      portfolioId: PortfolioStore.selectedPortfolioId,
      value: this.timeValue,
      name: 'Closing time',
      userId: 1,
    };

    requester.User.updateClosingTime(newClosingTime)
      .then((result) => {
        console.log(result);
      });
  }
}

export default new UserStore();
