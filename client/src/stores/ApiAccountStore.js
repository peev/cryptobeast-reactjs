import { observable, action } from 'mobx';
import requester from '../services/requester';
import AssetStore from './AssetStore';

class ApiAccountStore {
  @observable
  values = {
    apiServiceName: '',
    apiKey: '',
    apiSecret: '',
    isActive: true,
  }

  constructor() {
    this.apiServiceName = '';
    this.apiKey = '';
    this.apiSecret = '';
    this.isActive = true;
  }

  @action
  setIsActive() {
    this.values.isActive = !this.values.isActive;
  }

  @action
  createNewAccount(id) {
    const newAccount = {
      apiServiceName: AssetStore.selectedExchangeCreateAccount,
      apiKey: this.values.apiKey,
      apiSecret: this.values.apiSecret,
      isActive: this.values.isActive,
      portfolioId: id,
    };

    requester.ApiAccount.addAccount(newAccount)
      .then(() => {
        // TODO: Something with result
      })
      .catch(this.onError);
  }


  @action
  setNewApiAccountValues(propertyType, newValue) {
    // all properties are send as string !!!
    this.values[propertyType] = newValue;
    // console.log('>>> values in api account store', this.values);
  }
}

export default new ApiAccountStore();
