// @flow
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

  @observable userApis: Array;

  constructor() {
    this.userApis = [];
  }

  @action
  setIsActive() {
    this.values.isActive = !this.values.isActive;
  }

  @action
  handleCreateNewAccountErrors(id: string) {
    const newAccount = {
      apiServiceName: AssetStore.selectedExchangeCreateAccount,
      apiKey: this.values.apiKey,
      apiSecret: this.values.apiSecret,
      isActive: this.values.isActive,
      portfolioId: id,
    };
    let noErrors = true;
    requester.ApiAccount.getBalance(newAccount)
      .then((data: object) => {
        if (!data.success) {
          NotificationStore.addMessage('errorMessages', 'Invalid API Key and API Secret combination');
          noErrors = false;
        }
      });

    return noErrors;
  }

  @action
  addNewApiAccount() {
    const currentUserAuthId = Authentication.getUserProfile().sub;
    const selectedExchangeName = AssetStore.selectedExchangeCreateAccount;
    const numberOfSameApiNames = this.userApis.filter((value: Array) => value[0] !== selectedExchangeName).length;
    const selectedExchangeNameModified = `${[selectedExchangeName]}_API_${numberOfSameApiNames}`;
    const newApiAccount = {
      user_metadata: {
        [selectedExchangeNameModified]: { // creates the name of the api
          apiKey: this.values.apiKey,
          apiSecret: this.values.apiSecret,
          isActive: this.values.isActive,
        },
      },
    };

    requester.User.patchUser(currentUserAuthId, newApiAccount)
      .then(action((result: object) => {
        if (result.data.isSuccessful) {
          NotificationStore.addMessage('successMessages', 'Successfully added API');

          const apiStatus = this.values.isActive ? 'Active' : 'Inactive';
          const apiToAdd = [selectedExchangeNameModified, apiStatus, '**********', '**********', ''];
          this.userApis.push(apiToAdd);
        }
      }));
  }


  @action
  setNewApiAccountValues(propertyType: string, newValue: string) {
    // all properties are send as string !!!
    this.values[propertyType] = newValue;
  }
}

export default new ApiAccountStore();
