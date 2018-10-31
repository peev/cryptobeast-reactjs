import { action, observable } from 'mobx';
import requester from '../services/requester';
import userApi from '../services/user';
import PortfolioStore from './PortfolioStore';

class WeidexStore {
  @observable snycingData;

  constructor() {
    this.snycingData = false;
  }

  @action sync = (addresses) => {
    this.snycingData = true;
    requester.Weidex.sync(addresses)
      .then(() => {
        PortfolioStore.getPortfoliosByAddresses(addresses);
        this.snycingData = false;
      })
      .catch((err) => {
        console.log(err);
        this.snycingData = false;
      });
  };

  printError(error) {
    return this.console.log(error);
  }
}

export default new WeidexStore();
