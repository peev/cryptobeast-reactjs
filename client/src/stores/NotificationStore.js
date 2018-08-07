// @flow
import { observable, action, computed, reaction, autorun } from 'mobx';

class NotificationStore {
  @observable errorMessages: Array<string>;
  @observable successMessages: Array<string>;
  @observable infoMessages: Array<string>;

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
  addMessage(kindOfMessage: string, message: string) {
    const result: boolean = this[kindOfMessage].includes(message);
    if (!result) {
      this[kindOfMessage].push(message);
    }
  }

  @action.bound
  resetMessages() {
    this.errorMessages = [];
    this.successMessages = [];
    this.infoMessages = [];
  }
}

export default new NotificationStore();
