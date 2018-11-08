// @flow
import { action, observable } from 'mobx';

class LoadingStore {
  @observable showContent;
  @observable showLoading;

  constructor() {
    this.showContent = false;
    this.showLoading = false;
  }

  @action
  setShowContent = (value: boolean) => {
    this.showContent = value;
  }

  @action
  setShowLoading = (value: boolean) => {
    this.showLoading = value;
  }
}

export default new LoadingStore();
