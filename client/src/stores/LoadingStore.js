// @flow
import { action, observable } from 'mobx';

class LoadingStore {
  @observable showContent;
  @observable showLoading;
  @observable syncing;

  constructor() {
    this.showContent = false;
    this.showLoading = false;
    this.syncing = false;
  }

  @action
  setShowContent = (value: boolean) => {
    this.showContent = value;
  }

  @action
  setShowLoading = (value: boolean) => {
    this.showLoading = value;
  }

  @action
  setSyncing = (value: boolean) => {
    this.syncing = value;
  }
}

export default new LoadingStore();
