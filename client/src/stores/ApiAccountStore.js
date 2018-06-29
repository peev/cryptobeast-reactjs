// @flow
import { observable, action } from 'mobx';
import requester from '../services/requester';
import AssetStore from './AssetStore';
import PortfolioStore from './PortfolioStore';
import NotificationStore from './NotificationStore';
import Authentication from '../services/Authentication';

class ApiAccountStore {
  @observable
  values = {
    account: '',
    exchange: '',
    apiKey: '',
    apiSecret: '',
    isActive: true,
  }
  @observable updateValues;
  @observable updateValues;
  @observable userApis: Array;
  @observable selectedApi: Object;
  placeholder: string = '***************';

  constructor() {
    this.updateValues = {};
    this.userApis = [];
    this.selectedApi = {};
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
    const portfolioId = PortfolioStore.selectedPortfolioId;
    const apiNameGenerate = `api_account_${this.userApis.length}`;
    const newApiAccount = {
      user_metadata: {
        [apiNameGenerate]: { // creates the name of the api
          exchange: selectedExchangeName,
          account: this.values.account,
          isActive: this.values.isActive,
          apiKey: this.values.apiKey,
          apiSecret: this.values.apiSecret,
          portfolioId,
        },
        api: {
          method: 'create',
          exchange: selectedExchangeName,
          apiKey: this.values.apiKey,
          apiSecret: this.values.apiSecret,
          portfolioId,
        },
      },
    };

    requester.User.verifiedPatchUserMetadata(currentUserAuthId, newApiAccount)
      .then(action((result: object) => {
        if (result.data.isSuccessful) {
          NotificationStore.addMessage('successMessages', 'Successfully added API');

          const apiStatus = this.values.isActive ? 'Active' : 'Inactive';
          const apiToAdd = [
            selectedExchangeName,
            this.values.account,
            apiStatus,
            this.placeholder,
            this.placeholder,
            apiNameGenerate,
            portfolioId,
          ];
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
    Object.assign(this.updateValues, { isActive: this.values.isActive });
    const updatedApiAccount = {
      user_metadata: {
        [apiID]: this.updateValues,
        api: {
          method: 'update',
          id: apiID,
        },
      },
    };

    requester.User.patchUserMetadata(currentUserAuthId, updatedApiAccount)
      .then(action((result: object) => {
        if (result.data.isSuccessful) {

          this.userApis = this.userApis.map((api: Array<any>) => {
            if (api[5] === apiID && updatedApiAccount.user_metadata[apiID].account !== undefined) {
              api[1] = updatedApiAccount.user_metadata[apiID].account;
              return api;
            } else if (api[5] === apiID && updatedApiAccount.user_metadata[apiID].isActive !== undefined) {
              const apiStatus = updatedApiAccount.user_metadata[apiID].isActive ? 'Active' : 'Inactive';
              api[2] = apiStatus;
              return api;
            }

            return api;
          });

          NotificationStore.addMessage('successMessages', 'Successfully updated API');
          this.resetApiAccount();
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

    requester.User.deleteUserMetadata(currentUserAuthId, emptyApiAccount)
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
      this.userApis.push([
        property[1].exchange,
        property[1].account,
        apiStatus,
        this.placeholder,
        this.placeholder,
        property[0],
        property[1].portfolioId,
      ]);
    });
  }

  @action
  setApiAccountForEditing(apiID: string) {
    const result = this.userApis.filter((api: Array<any>) => api[5] === apiID);
    this.values = {
      exchange: result[0][0],
      account: result[0][1],
      isActive: result[0][2],
      apiKey: result[0][3],
      apiSecret: result[0][4],
    };
  }

  @action
  setApiAccountUpdateValues(propertyType: string, newValue: string) {
    this.updateValues[propertyType] = newValue;
    this.values[propertyType] = newValue;
  }

  @action
  setNewApiAccountValues(propertyType: string, newValue: string) {
    // all properties are send as string !!!
    this.values[propertyType] = newValue;
  }

  @action.bound
  resetApiAccount() {
    this.values.exchange = '';
    this.values.account = '';
    this.values.isActive = true;
    this.values.apiKey = '';
    this.values.apiSecret = '';
    this.updateValues = {};
    AssetStore.selectedExchangeCreateAccount = '';
  }
}

export default new ApiAccountStore();
