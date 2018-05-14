import { observable, action, computed } from 'mobx';

class NotificationStore {
  @observable errorMessages;
  @observable successMessages;
  @observable infoMessages;

  constructor() {
    this.errorMessages = [];
    this.successMessages = [];
    this.infoMessages = [];
  }

  @computed
  get getErrorsLength() {
    return this.errorMessages.length;
  }
  @computed
  get getSuccessLength() {
    return this.successMessages.length;
  }
  @computed
  get getInfoLength() {
    return this.infoMessages.length;
  }

  @action.bound
  addMessage(kindOfMessage, message) {
    this[kindOfMessage].push(message);
  }

  @action.bound
  resetMessages() {
    this.errorMessages = [];
    this.successMessages = [];
    this.infoMessages = [];
  }
}

export default new NotificationStore();
