import { action, observable } from 'mobx';
import requester from '../services/requester';

class WeidexStore {
  @observable snycingData;

  constructor() {
    this.snycingData = false;
  }

  @action sync = (addresses) => {
    this.snycingData = true;
    requester.Weidex.sync(addresses)
      .then(() => {
        this.snycingData = false;
      })
      .catch((err) => {
        console.log(err);
        this.snycingData = false;
      });
  };
}

export default new WeidexStore();
