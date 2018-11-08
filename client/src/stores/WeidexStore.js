// @flow
/* eslint no-console: 0 */
import { action } from 'mobx';
import requester from '../services/requester';
import PortfolioStore from './PortfolioStore';
import LoadingStore from './LoadingStore';

class WeidexStore {
  @action
  validateAddresses = (addresses: Array<string>) => {
    LoadingStore.setShowContent(false);
    requester.Weidex.validateAddresses(addresses)
      .then((res: Array<string>) => {
        const addressesData = res.data;
        return (addressesData.length && addressesData.length > 0) ?
          PortfolioStore.sync(addressesData) : LoadingStore.setShowContent(true);
      })
      .catch((err: object) => {
        console.log(err);
        LoadingStore.setShowContent(true);
      });
  }
}

export default new WeidexStore();
