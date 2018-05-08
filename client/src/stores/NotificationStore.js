import { observable, action, computed } from 'mobx';

class NotificationStore {
  @observable errorMessages;
  @observable successMessages;

  constructor() {
    this.errorMessages = [];
    this.successMessages = [];
  }

  @computed
  get getErrorsLength() {
    return this.errorMessages.length;
  }
  @computed
  get getSuccessLength() {
    return this.successMessages.length;
  }

  @action.bound
  addMessage(kindOfMessage, message) {
    this[kindOfMessage].push(message);
  }

  @action.bound
  resetMessages() {
    this.errorMessages = [];
    this.successMessages = [];
  }
}

export default new NotificationStore();
