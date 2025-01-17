import { observable, action, computed } from 'mobx';
import requester from '../services/requester';
import MarketStore from './MarketStore';

class PortfolioStore {
  @observable portfolios;
  @observable selectedPortfolio;
  @observable selectedPortfolioId;
  @observable currentPortfolioAssets;
  @observable currentPortfolioInvestors;
  @observable currentPortfolioSharePrice;

  constructor() {
    this.portfolios = [];
    this.selectedPortfolio = null;
    this.selectedPortfolioId = null;
    this.currentPortfolioAssets = [];
    this.currentPortfolioInvestors = [];
    this.currentPortfolioSharePrice = 0;


    // eslint-disable-next-line no-unused-expressions
    this.getPortfolios(); // gets portfolios at app init
  }
  // ======= Computed =======
  // #region Computed
  // #region Summary Page
  @computed
  get summaryUsdEquivalent() {
    if (this.selectedPortfolio && MarketStore.baseCurrencies.length > 0) {
      const result = this.selectedPortfolio.cost * MarketStore.baseCurrencies[3].last; // NOTE: this if USD
      return result.toFixed(2);
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
      const result = ((this.summaryUsdEquivalent - this.summaryTotalInvestment) / this.summaryTotalInvestment) * 100;
      return result.toFixed(2);
    }

    return 0;
  }

  @computed
  get summaryPortfolioAssets() {
    // NOTE: all the conditions needs to be fulfilled in order to create
    // portfolio asset summary
    if (this.selectedPortfolio &&
      this.currentPortfolioAssets.length > 0 &&
      MarketStore.baseCurrencies.length > 0 &&
      MarketStore.marketSummaries.hasOwnProperty('BTC-ETH')) {
      const currentAssets = this.currentPortfolioAssets;
      const valueOfUSD = MarketStore.baseCurrencies[3].last; // NOTE: this if USD
      const selectedPortfolioSummary = [];

      // Creates the needed array, that will be shown in the view
      currentAssets.forEach((el, i) => {
        const currentRow = [];
        Object.keys(el).map((prop, ind) => {
          // 1. Ticker
          if (prop === 'currency') {
            currentRow.push(el[prop]);
          }
          // 2. Holdings
          if (prop === 'balance') {
            currentRow.push(el[prop]);
          }
          // ------------------------------
          // Depends on array's 0 index
          let assetBTCEquiv;
          if (currentRow[0] === 'BTC' && ind > 1) {
            assetBTCEquiv = MarketStore.marketSummaries[`USDT-${currentRow[0]}`].Last;
          } else {
            assetBTCEquiv = MarketStore.marketSummaries[`BTC-${currentRow[0]}`] ?
              MarketStore.marketSummaries[`BTC-${currentRow[0]}`].Last :
              0;
          }
          // ------------------------------
          // 3. Price(BTC)
          if (ind === 2) {
            let calcPriceBTC;
            if (currentRow[0] === 'BTC') {
              calcPriceBTC = el.balance;
            } else {
              calcPriceBTC = Math.round(assetBTCEquiv * (10 ** 12)) / (10 ** 12);
            }

            currentRow.push(calcPriceBTC);
          }
          // 4. Price(USD)
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
          // 5. Total Value(USD)
          if (ind === 4) {
            // console.log(assetBTCEquiv, valueOfUSD);
            let calcPriceUSD;
            if (currentRow[0] === 'BTC') {
              calcPriceUSD = assetBTCEquiv * el.balance;
            } else {
              calcPriceUSD = assetBTCEquiv * valueOfUSD;
            }

            const roundedCalcPriceUSD = Math.round(calcPriceUSD * (10 ** 12)) / (10 ** 12);
            currentRow.push(roundedCalcPriceUSD);
          }
          // 6. Asset Weight
          if (ind === 5) {
            const ifPortfolioCost = this.currentSelectedPortfolioCost !== 0 ? this.currentSelectedPortfolioCost : 1;
            const percentOfItem = ((currentRow[4] / ifPortfolioCost) * 100).toFixed(0);
            currentRow.push(percentOfItem);
          }
          // 7. 24H Change
          if (ind === 6) {
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
                yesterdayCost = MarketStore.marketSummaries[`USDT-${currentRow[0]}`].PrevDay;
                changeFromYesterday = (((assetBTCEquiv - yesterdayCost) / yesterdayCost) * 100).toFixed(2);
                break;
              default:
                if (MarketStore.marketSummaries[`BTC-${currentRow[0]}`]) {
                  yesterdayCost = MarketStore.marketSummaries[`BTC-${currentRow[0]}`].PrevDay;
                  changeFromYesterday = (((assetBTCEquiv - yesterdayCost) / yesterdayCost) * 100).toFixed(2);
                  break;
                } else {
                  changeFromYesterday = 'n/a';
                  break;
                }
            }

            currentRow.push(changeFromYesterday);
          }
          // 8. 7D Change
          if (ind === 7) {
            // FIXME: add real value
            currentRow.push(12.54 + i);
          }
        });

        selectedPortfolioSummary.push(currentRow);
      });

      return selectedPortfolioSummary;
    }

    return [];
  }
  // #endregion

  @computed
  get currentSelectedPortfolioCost() {
    // FIXME: Portfolio cost is calculated here,
    // because the value from database is incorrect
    if (this.selectedPortfolio && this.currentPortfolioAssets.length > 0) {
      const valueOfUSD = MarketStore.baseCurrencies[3].last; // NOTE: this if USD
      return this.currentPortfolioAssets.reduce((array, el) => {
        let assetBTCValue;
        if (el.currency === 'BTC') {
          assetBTCValue = MarketStore.marketSummaries[`USDT-${el.currency}`].Last * el.balance;
        } else {
          const assetBTCEquiv = MarketStore.marketSummaries[`BTC-${el.currency}`] ?
            MarketStore.marketSummaries[`BTC-${el.currency}`].Last :
            0;

          assetBTCValue = assetBTCEquiv * valueOfUSD;
        }

        return array + assetBTCValue;
      }, 0);
    }

    return 0;
  }
  // #endregion

  // ======= Action =======
  // Portfolio -> Create, Update, Delete
  // #region Portfolio
  @action
  createPortfolio(portfolioName) {
    requester.Portfolio.create(portfolioName)
      .then(() => {
        this.getPortfolios(); // gets new portfolios
      })
      .catch(err => console.log(err));
  }

  @action
  updatePortfolio(portfolioName, id) {
    requester.Portfolio.update(portfolioName, id)
      .then(() => {
        this.getPortfolios();
      })
      .catch(err => console.log(err));
  }

  @action
  removePortfolio(id) {
    requester.Portfolio.delete(id)
      .then(() => {
        this.getPortfolios();
      })
      .catch(err => console.log(err));
  }
  // #endregion

  @action
  selectPortfolio(id) {
    this.selectedPortfolioId = id;

    this.portfolios.forEach((el) => {
      // Returns only needed values from selected portfolio
      if (el.id === id) {
        this.selectedPortfolio = { ...el };
        this.currentPortfolioAssets = el.assets;
        this.currentPortfolioInvestors = el.investors;
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
      .catch(err => console.log(err));
  }
}

export default new PortfolioStore();
