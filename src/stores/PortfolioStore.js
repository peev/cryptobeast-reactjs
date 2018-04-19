import { observable, action, computed } from 'mobx';
import requester from '../services/requester';
import MarketStore from './MarketStore';

class PortfolioStore {
  @observable portfolios;
  @observable selectedPortfolio;
  @observable selectedPortfolioId;
  @observable currentPortfolioAssets;

  @observable currentPortfolioSharePrice;
  @observable selectedPortfolioUsdEquivalent;
  @observable currentPortfolioTotalInvestment;
  @observable selectedPortfolioTotalDifference;
  @observable selectedPortfolioTotalProfitLoss;

  constructor() {
    this.portfolios = [];
    this.selectedPortfolio = null;
    this.selectedPortfolioId = null;
    this.currentPortfolioAssets = null;
    this.currentPortfolioSharePrice = 0;
    this.selectedPortfolioUsdEquivalent = 0;
    this.currentPortfolioTotalInvestment = 0;
    this.selectedPortfolioTotalDifference = 0;
    this.selectedPortfolioTotalProfitLoss = 0;

    // eslint-disable-next-line no-unused-expressions
    this.getPortfolios(); // gets portfolios at app init
  }

  @computed
  get getAllPortfolios() {
    return this.portfolios;
  }

  @computed
  get currentPortfolio() {
    return this.selectedPortfolio;
  }

  @computed
  get summaryTotalNumberOfShares() {
    if (this.selectedPortfolio) {
      return this.selectedPortfolio.shares;
    }

    return 0;
  }

  @computed
  get summarySharePrice() {
    if (this.selectedPortfolio) {
      const result = this.currentPortfolioSharePrice.toFixed(2);
      return result;
    }

    return 0;
  }

  @computed
  get summaryUsdEquivalent() {
    if (this.selectedPortfolio) {
      const result = (this.selectedPortfolio.cost * MarketStore.baseCurrencies[3].last).toFixed(2);
      return result;
    }

    return 0;
  }

  @computed
  get summaryTotalInvestment() {
    if (this.selectedPortfolio && this.selectedPortfolio.transactions.length > 0) {
      let totalAmount = 0;
      this.selectedPortfolio.transactions.forEach((el) => {
        if (el.shares > 0) {
          totalAmount += el.amountInUSD;
        } else {
          totalAmount -= el.amountInUSD;
        }
      });

      return totalAmount.toFixed(2);
    }

    return 0;
  }

  @computed
  get summaryTotalProfitLoss() {
    if (this.selectedPortfolio && this.selectedPortfolio.transactions.length > 0) {
      const result = (((this.summaryUsdEquivalent - this.summaryTotalInvestment) / this.summaryTotalInvestment) * 100).toFixed(2);
      return result;
    }

    return 0;
  }

  @computed
  get currentSelectedPortfolioCost() {
    // FIXME: Portfolio cost is calculated here,
    // because the value from database is incorrect
    if (this.selectedPortfolio && this.selectedPortfolio.assets.length > 0) {
      return this.selectedPortfolio.assets.reduce((array, el) => array + el.lastBTCEquivalent, 0);
    }

    return 0;
  }

  @computed
  get summaryPortfolioAssets() {
    if (this.selectedPortfolio && this.selectedPortfolio.assets) {
      const currentAssets = this.selectedPortfolio.assets;
      const valueOfUSD = MarketStore.baseCurrencies[3].last;
      const selectedPortfolioSummary = [];

      currentAssets.forEach((el, i) => {
        const currentRow = [];
        Object.keys(el).map((prop, ind) => {
          const assetBTCEquiv = el.lastBTCEquivalent ? el.lastBTCEquivalent : 0;
          // Ticker
          if (prop === 'currency') {
            currentRow.push(el[prop]);
          }
          // Holdings
          if (prop === 'balance') {
            currentRow.push(el[prop]);
          }
          // Price(BTC)
          if (ind === 2) {
            const calcPriceBTC = Math.round(assetBTCEquiv * (10 ** 12)) / (10 ** 12);
            currentRow.push(calcPriceBTC);
          }
          // Price(USD)
          if (ind === 3) {
            let calculatedUSDPrice;
            // for BTC, value is already
            if (currentRow[0] === 'BTC') {
              calculatedUSDPrice = Math.round(assetBTCEquiv * (10 ** 12)) / (10 ** 12);
            } else {
              calculatedUSDPrice = (assetBTCEquiv * valueOfUSD) / el.balance;
            }

            const roundedCalcPriceUSD = Math.round(calculatedUSDPrice * (10 ** 12)) / (10 ** 12);
            currentRow.push(roundedCalcPriceUSD);
          }
          // Total Value(USD)
          if (ind === 4) {
            const calcPriceUSD = assetBTCEquiv * valueOfUSD;
            const roundedCalcPriceUSD = Math.round(calcPriceUSD * (10 ** 12)) / (10 ** 12);
            currentRow.push(roundedCalcPriceUSD);
          }
          // Asset Weight
          if (ind === 5) {
            const percentOfItem = ((assetBTCEquiv / this.currentSelectedPortfolioCost) * 100).toFixed(0);
            currentRow.push(percentOfItem);
          }
          // 24H Change
          if (ind === 6) {
            // FIXME: add real value
            currentRow.push(4.92 + i);
          }
          // 7D Change
          if (ind === 7) {
            // FIXME: add real value
            currentRow.push(12.54 + i);
          }
        });

        selectedPortfolioSummary.push(currentRow);
      });

      return selectedPortfolioSummary;
    }

    return 0;
  }

  @action
  getCurrentPortfolio() {
    if (this.selectedPortfolio) {
      return this.selectedPortfolio.shares;
    }

    return 0;
  }

  @action
  selectPortfolio(id) {
    this.selectedPortfolioId = id;

    this.portfolios.forEach((el) => {
      // Returns only selected element
      if (el.id === id) {
        this.selectedPortfolio = { ...el };
      }
    });

    requester.Portfolio.getSharePrice({ id })
      .then(action((sharePrice) => {
        this.currentPortfolioSharePrice = sharePrice.data.sharePrice;
      }));
  }

  @action
  getPortfolios() {
    return requester.Portfolio.getAll()
      .then(action((result) => {
        this.portfolios = result.data;
      }))
      .catch(this.onError);
  }

  @action
  createPortfolio(portfolioName) {
    requester.Portfolio.create(portfolioName)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        this.getPortfolios(); // gets new portfolios
      })
      .catch(this.onError);
  }

  @action
  updatePortfolio(portfolioName, id) {
    requester.Portfolio.update(portfolioName, id)
      .then(() => {
        this.getPortfolios();
      })
      .catch(this.onError);
  }

  @action
  removePortfolio(id) {
    requester.Portfolio.delete(id)
      .then(() => {
        this.getPortfolios();
      })
      .catch(this.onError);
  }
  // @action.bound
  // removePortfolio(selectedPortfolio) {
  //   this.portfolios = this.portfolios.filter(i => i !== selectedPortfolio);
  //   this.portfolios.remove(selectedPortfolio);
  // }

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  onError(err) {
    console.log(err);
  }
}

export default new PortfolioStore();
