import { observable, action, reaction } from 'mobx';
import { CrossStorageClient } from 'cross-storage';
import userApi from '../services/user';
import PortfolioStore from './PortfolioStore';
import NotificationStore from './NotificationStore';
import requester from '../services/requester';

const baseURL = 'http://localhost:8080/hub.html';

class UserStore {
  @observable data;
  @observable timeValue;
  @observable timeType;
  @observable profile;
  @observable userAddresses;

  constructor() {
    this.data = {};
    this.timeValue = '23:59';
    this.timeType = true;
    this.profile = {};
    this.userAddresses = [];
    
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
  getUserProfile() {
    userApi.getUserProfile().then(action((profile) => {
      this.profile = { ...profile };
    }));
  }

  @action
  setPortfolio(portfolioId) {
    this.data.selectedPortfolio = portfolioId;
    this.saveData();
  }

  @action.bound
  getUserAddresses() {
    const client = new CrossStorageClient(baseURL, {
      timeout: 0,
      frameId: 'null',
    });

    client.onConnect()
      .then(() => client.get('WALLETS_INFO'))
      .then((res) => {
        console.log(res);
        this.userAddresses = res;
      })
      .catch(err => console.log(err));
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


    NotificationStore.addMessage('successMessages', 'Closing time successfully set');

    requester.User.updateClosingTime(newClosingTime)
      .then((result) => {
        console.log(result); // eslint-disable-line
      });
  }
}

export default new UserStore();
