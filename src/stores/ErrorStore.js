import { observable, action, computed } from 'mobx';

class ErrorStore {
  @observable errors;

  constructor() {
    this.errors = [];
  }

  @computed
  get getErrorsLength() {
    return this.errors.length;
  }

  @action.bound
  addError(message) {
    this.errors.push(message);
  }

  @action.bound
  resetErrors() {
    this.errors = [];
  }
}

export default new ErrorStore();
