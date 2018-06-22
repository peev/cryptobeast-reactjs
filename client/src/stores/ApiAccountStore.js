import { observable, action } from 'mobx';
import requester from '../services/requester';
import AssetStore from './AssetStore';
import NotificationStore from './NotificationStore';
import Authentication from '../services/Authentication';

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
  handleCreateNewAccountErrors(id) {
    const newAccount = {
      apiServiceName: AssetStore.selectedExchangeCreateAccount,
      apiKey: this.values.apiKey,
      apiSecret: this.values.apiSecret,
      isActive: this.values.isActive,
      portfolioId: id,
    };
    let noErrors = true;
    requester.ApiAccount.getBalance(newAccount)
      .then((data) => {
        if (!data.success) {
          NotificationStore.addMessage('errorMessages', 'Invalid API Key and API Secret combination');
          noErrors = false;
        }
      });

    return noErrors;
  }

  @action
  addNewApiAccount() {
    const newApiAccount = {
      user_metadata: {
        apiServiceName: AssetStore.selectedExchangeCreateAccount,
        apiKey: this.values.apiKey,
        apiSecret: this.values.apiSecret,
        isActive: this.values.isActive,
      },
    };

    Authentication.patchUserData(newApiAccount)
      .then((result) => {
        console.log(result);
      });
    Authentication.getUserData()
      .then((result) => {
        console.log(result);
      });
  }


  @action
  setNewApiAccountValues(propertyType, newValue) {
    // all properties are send as string !!!
    this.values[propertyType] = newValue;
    // console.log('>>> values in api account store', this.values);
  }
}

export default new ApiAccountStore();
