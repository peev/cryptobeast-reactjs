import { observable, action, computed } from 'mobx';

class PortfolioStore {
  constructor() {
    this.getAllPortfolios = action(this.getAllPortfolios);
  }

  // @observable
  name = observable('');

  // @action
  getAllPortfolios = action(() => {
    return this.name;
  })

  // @computed
  upperCaseName = computed(() =>
    this.name.get().toUpperCase()
  );

  // action("getAllPortfolios", (error, result) => {
  // })
}

export default new PortfolioStore();
