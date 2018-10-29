import { action } from 'mobx';
import requester from '../services/requester';

class WeidexStore {
  @action sync = (addresses) => {
    requester.Weidex.sync(addresses)
      .then(() => console.log('success'))
      .catch(err => console.log(err));
  };
}

export default new WeidexStore();
