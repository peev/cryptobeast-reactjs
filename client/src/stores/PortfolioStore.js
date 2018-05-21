/* eslint no-console: 0 */
/* eslint no-prototype-builtins: 0 */

import {
  observable,
  action,
  computed,
  // autorun,
} from 'mobx';
import requester from '../services/requester';
import MarketStore from './MarketStore';
import InvestorStore from './InvestorStore';

class PortfolioStore {
  @observable portfolios;
  @observable selectedPortfolio;
  @observable selectedPortfolioId;
  @observable currentPortfolioAssets;
  @observable currentPortfolioInvestors;
  @observable currentPortfolioTransactions;
  @observable newPortfolioName;

  constructor() {
    this.portfolios = [];
    this.selectedPortfolio = null;
    this.selectedPortfolioId = 0;
    this.currentPortfolioAssets = [];
    this.currentPortfolioInvestors = [];
    this.currentPortfolioTransactions = [];
    this.newPortfolioName = '';


    // eslint-disable-next-line no-unused-expressions
    // gets portfolios at app init
    this.getPortfolios().then(() => {
      if (this.portfolios.length > 0) {
        MarketStore.init();
      }
    });
  }
  // ======= Computed =======
  // #region Computed
  // #region Summary Page
  @computed
  get summaryTotalInvestmentInUSD() {
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
      const result = ((this.currentPortfolioCostInUSD - this.summaryTotalInvestmentInUSD) / this.summaryTotalInvestmentInUSD) * 100;
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
        Object.keys(el).forEach((prop, ind) => {
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
              calculatedUSDPrice = valueOfUSD;
            } else {
              calculatedUSDPrice = (assetBTCEquiv * valueOfUSD);
            }

            const roundedCalcPriceUSD = Math.round(calculatedUSDPrice * (10 ** 12)) / (10 ** 12);
            currentRow.push(roundedCalcPriceUSD);
          }
          // 5. Total Value(USD)
          if (ind === 4) {
            const calcPriceUSD = currentRow[3] * el.balance;
            const roundedCalcPriceUSD = Math.round(calcPriceUSD * (10 ** 12)) / (10 ** 12);
            currentRow.push(roundedCalcPriceUSD);
          }
          // 6. Asset Weight
          if (ind === 5) {
            const ifPortfolioCost = this.currentPortfolioCostInUSD !== 0 ?
              this.currentPortfolioCostInUSD : 1;
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
                changeFromYesterday = (((assetBTCEquiv - yesterdayCost) / yesterdayCost) * 100)
                  .toFixed(2);
                break;
              default:
                if (MarketStore.marketSummaries[`BTC-${currentRow[0]}`]) {
                  yesterdayCost = MarketStore.marketSummaries[`BTC-${currentRow[0]}`].PrevDay;
                  changeFromYesterday = (((assetBTCEquiv - yesterdayCost) / yesterdayCost) * 100)
                    .toFixed(2);
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
  get currentMarketSummaryPercentageChange() {
    if (this.selectedPortfolio &&
      MarketStore.baseCurrencies.length > 0) {
      const marketSummary = MarketStore.marketPriceHistory;

      return Object.keys(marketSummary)
        .map((el) => {
          const name = marketSummary[el].currency;
          const change24h = marketSummary[el].percentChangeFor24h;
          const change7d = marketSummary[el].percentChangeFor7d;
          return [name, change24h, change7d];
        })
        .sort((a, b) => b[1] - a[1]);
    }

    return [];
  }

  get summaryAssetsBreakdown() {
    return this.summaryPortfolioAssets.map(el => ({
      y: parseInt(el[5], 10),
      name: `${el[0]} (${el[5]}%)`,
    }));
  }

  @computed
  get currentPortfolioCostInUSD() {
    // NOTE: Portfolio cost is calculated here,
    // because the value from database is incorrect
    if (this.selectedPortfolio &&
      MarketStore.baseCurrencies.length > 0 &&
      this.currentPortfolioAssets.length > 0) {
      const valueOfUSD = MarketStore.baseCurrencies[3].last; // NOTE: this is USD
      return this.currentPortfolioAssets.reduce((accumulator, el) => {
        let assetUSDValue;
        switch (el.currency) {
          case 'JPY':
          case 'EUR':
          case 'USD': {
            const wantedCurrency = MarketStore.baseCurrencies.filter(x => x.pair === el.currency)[0];
            assetUSDValue = (el.balance / wantedCurrency.last) * valueOfUSD;
            break;
          }
          case 'BTC': {
            assetUSDValue = el.balance * valueOfUSD;
            break;
          }
          default: {
            const assetBTCEquiv = MarketStore.marketSummaries[`BTC-${el.currency}`] ?
              (MarketStore.marketSummaries[`BTC-${el.currency}`].Last * el.balance) :
              0;
            assetUSDValue = assetBTCEquiv * valueOfUSD;
            break;
          }
        }
        return accumulator + assetUSDValue;
      }, 0);
    }

    return 0;
  }

  @computed
  get currentPortfolioSharePrice() {
    if (this.selectedPortfolio) {
      return (this.currentPortfolioCostInUSD || 1) / (this.selectedPortfolio.shares || 1);
    }
    return 1;
  }

  @computed
  get currentPortfolioInvestorsCount() {
    if (this.selectedPortfolio) {
      return this.currentPortfolioInvestors.length;
    }

    return 0;
  }



  // #endregion

  // ======= Action =======
  // Portfolio -> Create, Update, Delete
  // #region Portfolio
  @action
  addTransaction(transactionData) {
    this.currentPortfolioTransactions.push(transactionData);
  }

  @action.bound
  setNewPortfolioName(newValue) {
    this.newPortfolioName = newValue;
  }

  @action.bound
  createPortfolio() {
    const newPortfolio = {
      name: this.newPortfolioName,
      // shares: InvestorStore.convertedUsdEquiv,
    };
    requester.Portfolio.create(newPortfolio)
      .then(action((result) => {
        this.getPortfolios(); // gets new portfolios
        this.selectedPortfolioId = result.data.id;
        InvestorStore.createDefaultInvestor(result.data.id);
      }))
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
    InvestorStore.selectedInvestor = ''; // reset InvestorDetailsTable
    this.selectedPortfolioId = id;
    this.portfolios.forEach((el) => {
      // Returns only needed values from selected portfolio
      if (el.id === id) {
        this.selectedPortfolio = { ...el };
        this.currentPortfolioAssets = el.assets;
        this.currentPortfolioInvestors = el.investors;
        this.currentPortfolioTransactions = el.transactions;
        this.currentPortfolioTrades = el.trades;
      }
    });
  }

  @action
  getPortfolios() {
    return new Promise((resolve, reject) => {
      requester.Portfolio.getAll()
        .then(action((result) => {
          this.portfolios = result.data;
          if (this.selectedPortfolioId > 0) {
            this.selectPortfolio(this.selectedPortfolioId);
          }
          resolve(true);
        }))
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }


  @action.bound
  resetPortfolio() {
    this.newPortfolioName = '';
  }
}

export default new PortfolioStore();
