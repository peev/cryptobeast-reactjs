import { observable, action, computed } from 'mobx';
import requester from '../services/requester';
import MarketStore from './MarketStore';

class PortfolioStore {
  @observable portfolios;
  @observable selectedPortfolio;
  @observable selectedPortfolioId;
  @observable currentPortfolioAssets;
  @observable currentPortfolioSharePrice;

  constructor() {
    this.portfolios = [];
    this.selectedPortfolio = null;
    this.selectedPortfolioId = null;
    this.currentPortfolioAssets = [];
    this.currentPortfolioSharePrice = 0;


    // eslint-disable-next-line no-unused-expressions
    this.getPortfolios(); // gets portfolios at app init
  }

  @computed
  get summaryUsdEquivalent() {
    if (this.selectedPortfolio && MarketStore.baseCurrencies.length > 0) {
      const result = (this.selectedPortfolio.cost * MarketStore.baseCurrencies[3].last).toFixed(2); // NOTE: this if USD
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
    if (this.selectedPortfolio && this.currentPortfolioAssets.length > 0) {
      return this.currentPortfolioAssets.reduce((array, el) => array + el.lastBTCEquivalent, 0);
    }

    return 0;
  }

  @computed
  get summaryPortfolioAssets() {
    // NOTE: all the conditions needs to fulfilled in order to create
    // portfolio asset summary
    if (this.selectedPortfolio &&
      this.currentPortfolioAssets.length > 0 &&
      MarketStore.baseCurrencies.length > 0 &&
      MarketStore.marketSummaries.hasOwnProperty("BTC-ETH")) {

      const currentAssets = this.currentPortfolioAssets;
      const valueOfUSD = MarketStore.baseCurrencies[3].last; // NOTE: this if USD
      const selectedPortfolioSummary = [];

      // Creates the needed array, that will be shown in the view
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
            const ifPortfolioCost = this.currentSelectedPortfolioCost !== 0 ? this.currentSelectedPortfolioCost : 1;
            const percentOfItem = ((assetBTCEquiv / ifPortfolioCost) * 100).toFixed(0);
            currentRow.push(percentOfItem);
          }
          // 24H Change
          if (ind === 6) {
            let lastCost;
            let yesterdayCost;
            let changeFromYesterday;
            switch (currentRow[0]) {
              case 'USD':
                changeFromYesterday = 'n/a';
                break;
              case 'EUR':
                changeFromYesterday = 'n/a';
                break;
              case 'JPY':
                changeFromYesterday = 'n/a';
                break;
              case 'BTC':
                lastCost = MarketStore.marketSummaries[`USDT-${currentRow[0]}`].Last;
                yesterdayCost = MarketStore.marketSummaries[`USDT-${currentRow[0]}`].PrevDay;
                changeFromYesterday = (((lastCost - yesterdayCost) / yesterdayCost) * 100).toFixed(2);
                break;
              default:
                lastCost = MarketStore.marketSummaries[`BTC-${currentRow[0]}`].Last;
                yesterdayCost = MarketStore.marketSummaries[`BTC-${currentRow[0]}`].PrevDay;
                changeFromYesterday = (((lastCost - yesterdayCost) / yesterdayCost) * 100).toFixed(2);
                break;
            }
            // FIXME: add real value
            currentRow.push(changeFromYesterday);
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
  selectPortfolio(id) {
    this.selectedPortfolioId = id;

    this.portfolios.forEach((el) => {
      // Returns only selected element
      if (el.id === id) {
        this.selectedPortfolio = { ...el };
        this.currentPortfolioAssets = el.assets;
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

  @action.bound
  // eslint-disable-next-line class-methods-use-this
  onError(err) {
    console.log(err);
  }
}

export default new PortfolioStore();
