import { observable } from 'mobx';
// import requester from '../services/requester';

class AssetStore {
  @observable
  selectedAssetsId = null;

  @observable
  selectedAssets = null;
}

export default new AssetStore();
