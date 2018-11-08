import { action, observable, onBecomeObserved } from 'mobx';
import requester from '../services/requester';
import PortfolioStore from './PortfolioStore';
import weidexApi from '../services/Weidex';

class WeidexStore {
  @observable snycingData;
  @observable validAddresses;

  constructor() {
    this.snycingData = false;
    this.validAddresses = [];
  }

  @action
  validateAddresses = (addresses) => {
    this.snycingData = true;
    requester.Weidex.validateAddresses(addresses)
      .then((res) => {
        this.validAddresses = res.data;
        this.sync(this.validAddresses);
      })
      .catch((err) => {
        console.log(err);
        this.snycingData = false;
        this.PortfolioStore.showContent = true;
      });
  }

  @action
  sync = (addresses) => {
    if (this.validAddresses.length > 0) {
      requester.Weidex.sync(addresses)
        .then(() => {
          PortfolioStore.getPortfoliosByAddresses(addresses);
          this.snycingData = false;
        })
        .catch((err) => {
          console.log(err);
          this.snycingData = false;
        });
    } else {
      this.snycingData = false;
      PortfolioStore.showContent = true;
    }
  };
}

export default new WeidexStore();
