// @flow
import { action, observable } from 'mobx';
import history from '../services/History';
import PortfoloStore from '../stores/PortfolioStore';

class LoadingStore {
  @observable showContent;
  @observable showLoading;
  @observable syncing;
  @observable ableToLogin;
  @observable showErrorPage;

  constructor() {
    this.showContent = false;
    this.showLoading = false;
    this.syncing = false;
    this.ableToLogin = false;
    this.showErrorPage = false;
  }

  @action
  handleRedirect() {
    if (PortfoloStore.portfolios.length === 0) {
      this.ableToLogin = false;
      this.showErrorPage = true;
    } else if (PortfoloStore.portfolios.length === 1) {
      this.handleRedirectHelper(true);
    } else {
      if (PortfoloStore.selectedPortfolioId > 0) {
        this.handleRedirectHelper(false);
      } else {
        PortfoloStore.selectPortfolio(0, false);
        this.ableToLogin = false;
      }
    }
  }

  /**
   * Check for reolation between selected portfolio id and user address from local storage.
   * @param {boolean} singleAddress
   */
  handleRedirectHelper(singleAddress: boolean) {
    const selectedPortfolio = PortfoloStore.portfolios.find((portfolio: Object) => portfolio.id === PortfoloStore.selectedPortfolioId);
    if (selectedPortfolio !== null && selectedPortfolio !== undefined) {
      PortfoloStore.selectPortfolio(selectedPortfolio.id, true);
      this.ableToLogin = true;
    } else {
      if (singleAddress) {
        // Skip old one, choose currend and proceed
        PortfoloStore.selectPortfolio(PortfoloStore.portfolios[0].id, true);
        this.ableToLogin = true;
      } else {
        // redirect to select screen
        if (global.window.location.pathname !== '/') {
          PortfoloStore.selectPortfolio(0, false);
          this.ableToLogin = false;
          history.push('/');
        } else {
          PortfoloStore.selectPortfolio(0, false);
          this.ableToLogin = false;
        }
      }
    }
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
