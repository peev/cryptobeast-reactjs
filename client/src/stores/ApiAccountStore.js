// @flow
import { observable, action } from 'mobx';
import requester from '../services/requester';
import AssetStore from './AssetStore';
import NotificationStore from './NotificationStore';
import Authentication from '../services/Authentication';

class ApiAccountStore {
  @observable
  values = {
    account: '',
    apiServiceName: '',
    apiKey: '',
    apiSecret: '',
    isActive: true,
  }

  @observable userApis: Array;
  placeholder: string = '***************';

  constructor() {
    this.userApis = [];
  }

  @action
  setIsActive() {
    this.values.isActive = !this.values.isActive;
  }

  @action
  handleCreateNewAccountErrors() {
    let noErrors = true;
    const selectedExchangeName = AssetStore.selectedExchangeCreateAccount;

    // Checks if exchange with this account already exists
    this.userApis.forEach((apiValues: Array) => {
      if (apiValues[0] === selectedExchangeName
        && apiValues[1] === this.values.account) {
        NotificationStore.addMessage('errorMessages', 'This account already exists with same exchange');
        noErrors = false;
      }
    });

    return noErrors;
  }

  @action
  addNewApiAccount() {
    const currentUserAuthId = Authentication.getUserProfile().sub;
    const selectedExchangeName = AssetStore.selectedExchangeCreateAccount;
    const apiNameGenerate = `api_account_${this.userApis.length}`;
    const newApiAccount = {
      user_metadata: {
        [apiNameGenerate]: { // creates the name of the api
          exchange: selectedExchangeName,
          account: this.values.account,
          apiKey: this.values.apiKey,
          apiSecret: this.values.apiSecret,
          isActive: this.values.isActive,
        },
        uploadApi: {
          exchange: selectedExchangeName,
          apiKey: this.values.apiKey,
          apiSecret: this.values.apiSecret,
        },
      },
    };

    requester.User.verifiedPatchUserMetadata(currentUserAuthId, newApiAccount)
      .then(action((result: object) => {
        if (result.data.isSuccessful) {
          NotificationStore.addMessage('successMessages', 'Successfully added API');

          const apiStatus = this.values.isActive ? 'Active' : 'Inactive';
          const apiToAdd = [selectedExchangeName, this.values.account, apiStatus, this.placeholder, this.placeholder, apiNameGenerate];
          this.userApis.push(apiToAdd);

          this.resetApiAccount();
        } else if (!result.data.isSuccessful) {
          NotificationStore.addMessage('errorMessages', 'The API Key and Secret are invalid');
        }
      }));
  }

  @action
  updateApiAccount(apiID: string) {
    const currentUserAuthId = Authentication.getUserProfile().sub;
    const selectedExchangeName = AssetStore.selectedExchangeCreateAccount;
    const emptyApiAccount = {
      user_metadata: {
        [apiID]: {
          exchange: selectedExchangeName,
          account: this.values.account,
          apiKey: this.values.apiKey,
          apiSecret: this.values.apiSecret,
          isActive: this.values.isActive,
        },
      },
    };

    requester.User.patchUserMetadata(currentUserAuthId, emptyApiAccount)
      .then(action((result: object) => {
        if (result.data.isSuccessful) {
          // TODO: update view

          NotificationStore.addMessage('successMessages', 'Successfully updated API');
        }
      }));
  }

  @action
  deleteApiAccount(apiID: string) {
    const currentUserAuthId = Authentication.getUserProfile().sub;
    const emptyApiAccount = {
      user_metadata: {
        [apiID]: {},
      },
    };

    requester.User.patchUserMetadata(currentUserAuthId, emptyApiAccount)
      .then(action((result: object) => {
        if (result.data.isSuccessful) {
          NotificationStore.addMessage('successMessages', 'Successfully removed API');

          this.userApis = this.userApis.filter((api: Array<any>) => api[5] !== apiID);
        }
      }));
  }

  @action
  convertUserApis(user: user) {
    user.forEach((property: Array<string, object>) => {
      const apiStatus = property[1].isActive ? 'Active' : 'Inactive';
      this.userApis.push([property[1].exchange, property[1].account, apiStatus, this.placeholder, this.placeholder, property[0]]);
    });
  }

  @action
  setNewApiAccountValues(propertyType: string, newValue: string) {
    // all properties are send as string !!!
    this.values[propertyType] = newValue;
  }

  @action
  resetApiAccount() {
    this.values.account = '';
    this.values.apiKey = '';
    this.values.apiSecret = '';
    this.values.apiServiceName = '';
    this.values.isActive = true;
    AssetStore.selectedExchangeCreateAccount = '';
  }
}

export default new ApiAccountStore();
