// @flow
import { observable, action, computed, ObservableMap } from 'mobx';
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
  @observable updateValues: Object;
  @observable userApis: ObservableMap;
  @observable selectedApi: Object;
  placeholder: string = '***************';

  constructor() {
    this.updateValues = {};
    this.userApis = observable.map();
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
    this.userApis.forEach((values: object) => {
      if (values.exchange === selectedExchangeName
        && values.account === this.values.account
        && values.portfolioId === PortfolioStore.selectedPortfolioId) {
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
    const apiNameGenerate = `api_account_${this.userApis.size}`;
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
          const apiToAdd = {
            exchange: selectedExchangeName,
            account: this.values.account,
            isActive: this.values.isActive,
            portfolioId,
          };
          this.userApis.set(apiNameGenerate, { ...apiToAdd });

          NotificationStore.addMessage('successMessages', 'Successfully added API');

          this.resetApiAccount();
        }
      }))
      .catch((error: object) => {
        if (error.response && !error.response.data.isSuccessful) {
          if (error.response.data.message) {
            NotificationStore.addMessage('errorMessages', error.response.data.message);
          } else if (selectedExchangeName === 'Kraken'
            && Object.keys(error.response.data.message).length === 0) {
            NotificationStore.addMessage('errorMessages', 'Invalid Api Key or Secret');
          }
        }
      });
  }

  @action
  updateApiAccount(apiID: string) {
    const currentUserAuthId = Authentication.getUserProfile().sub;
    // Object.assign(this.updateValues, { isActive: this.values.isActive });
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
          this.userApis.get(apiID);

          NotificationStore.addMessage('successMessages', 'Successfully updated API');
          this.resetApiAccount();
        }
      }))
      .catch((error: object) => {
        if (error.response && !error.response.data.isSuccessful) {
          NotificationStore.addMessage('errorMessages', error.response.data.message);
        }
      });
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

          this.userApis.set(apiID, {});
        }
      }))
      .catch((error: object) => {
        if (error.response && !error.response.data.isSuccessful) {
          NotificationStore.addMessage('errorMessages', error.response.data.message);
        }
      });
  }

  @action.bound
  // eslint-disable-next-line
  syncUserApiData() {
    const portfolioId = PortfolioStore.selectedPortfolioId;
    // const currentUserAuthId = Authentication.getUserProfile().sub;

    requester.User.syncUserApiData(portfolioId)
      .then((response: object) => console.log(response))
      .catch((error: object) => console.log(error));
  }

  @computed
  get convertUserApis() {
    const returnApis = [];
    if (this.userApis.size > 0) {
      this.userApis.forEach((values: object, key: string) => {
        if (values.exchange
          && PortfolioStore.selectedPortfolioId === values.portfolioId) {
          const apiStatus = values.isActive ? 'Active' : 'Inactive';

          returnApis.push([
            values.exchange,
            values.account,
            apiStatus,
            this.placeholder,
            this.placeholder,
            key,
            values.portfolioId,
          ]);
        }
      });

      return returnApis;
    }

    return returnApis;
  }

  @action.bound
  initializeUserApis(userMetadata: object) {
    Object.keys(userMetadata).forEach((property: object) => {
      this.userApis.set(property, {
        exchange: userMetadata[property].exchange,
        account: userMetadata[property].account,
        isActive: userMetadata[property].isActive,
        portfolioId: userMetadata[property].portfolioId,
      });
    });
  }

  @action
  setApiAccountForEditing(apiID: string) {
    const result = this.userApis.get(apiID);
    this.values = {
      exchange: result.exchange,
      account: result.account,
      isActive: result.isActive,
      apiKey: this.placeholder,
      apiSecret: this.placeholder,
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
