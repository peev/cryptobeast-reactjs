import { observable } from 'mobx';

class AssetStore {
  @observable selectedAssetsId;
  @observable selectedAssets;

  constructor() {
    this.selectedAssetsId = null;
    this.selectedAssets = null;
  }
}

export default new AssetStore();
