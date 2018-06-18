import { observable, action, computed, reaction, autorun } from 'mobx';

class NotificationStore {
  @observable errorMessages;
  @observable successMessages;
  @observable infoMessages;

  constructor() {
    this.errorMessages = [];
    this.successMessages = [];
    this.infoMessages = [];

    // This closes the notification popup after message is displayed.
    // Its made by mobx docs, so it doesn't make any side effects to observers
    reaction(
      () => this.getErrorsLength > 0 || this.getSuccessLength > 0 || this.getInfoLength > 0,
      () => autorun(() => this.resetMessages(), { delay: 6000 }),
    );
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
