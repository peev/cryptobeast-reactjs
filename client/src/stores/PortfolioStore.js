/* eslint no-console: 0 */
/* eslint no-prototype-builtins: 0 */

import {
  observable,
  action,
  computed,
  onBecomeObserved,
} from 'mobx';
import requester from '../services/requester';
import FiatCurrenciesStore from './FiatCurrenciesStore';
import MarketStore from './MarketStore';
import InvestorStore from './InvestorStore';
import NotificationStore from './NotificationStore';
import AssetStore from './AssetStore';
import Analytics from './Analytics';
import ApiAccountStore from './ApiAccountStore';
import history from '../services/History';
import userApi from '../services/user';
import storage from '../services/storage';

const persistedUserData = JSON.parse(window.localStorage.getItem('selected_portfolio_id')); // eslint-disable-line

class PortfolioStore {
  @observable fetchingPortfolios;
  @observable portfolios;
  @observable selectedPortfolio;
  @observable selectedPortfolioId;
  @observable currentPortfolioAssets;
  @observable currentPortfolioInvestors;
  @observable currentPortfolioTransactions;
  @observable currentPortfolioTrades;
  @observable currentPortfolioApiTradeHistory;
  @observable currentPortfolioPrices;
  @observable newPortfolioName;

  constructor() {
    this.portfolios = [];
    this.fetchingPortfolios = false;
    this.selectedPortfolio = null;
    this.selectedPortfolioId = persistedUserData ? persistedUserData : 0;
    this.currentPortfolioAssets = [];
    this.currentPortfolioInvestors = [];
    this.currentPortfolioTransactions = [];
    this.currentPortfolioTrades = [];
    this.currentPortfolioApiTradeHistory = [];
    this.currentPortfolioPrices = [];
    this.newPortfolioName = '';

    // only start data fetching if those properties are actually used!
    onBecomeObserved(this, 'currentPortfolioAssets', this.getCurrentPortfolioAssets);
    onBecomeObserved(this, 'currentPortfolioInvestors', this.getCurrentPortfolioInvestors);
    onBecomeObserved(this, 'currentPortfolioTransactions', this.getCurrentPortfolioTransactions);
    onBecomeObserved(this, 'currentPortfolioTrades', this.getCurrentPortfolioTrades);
    onBecomeObserved(this, 'currentPortfolioPrices', this.getCurrentPortfolioPrices);
  }

  @action
  setFetchingPortfolios(value) {
    this.fethingPortfolios = value;
  }
  // ======= Computed =======
  // #region Computed
  // #region Summary Page
  @computed
  get summaryTotalNumberOfShares() {
    return 0;
    // if (this.selectedPortfolio !== null && this.selectedPortfolio.shares !== null) {
    //   return this.selectedPortfolio.shares;
    // }

    // return 0;
  }

  @computed
  get summaryTotalInvestmentInUSD() {
    if (this.selectedPortfolio && this.currentPortfolioTransactions.length > 0) {
      let totalAmount = 0;
      this.currentPortfolioTransactions.forEach((el) => {
        totalAmount += el.amountInUSD;
      });

      return totalAmount.toFixed(2);
    }

    return 0;
  }

  @computed
  get summaryTotalProfitLoss() {
    if (this.selectedPortfolio && this.currentPortfolioTransactions.length > 0 && this.summaryTotalInvestmentInUSD !== 0) {
      const result = ((this.currentPortfolioCostInUSD - this.summaryTotalInvestmentInUSD) / this.summaryTotalInvestmentInUSD) * 100;
      return result.toFixed(2);
    }

    return 0;
  }

  // TODO: I am 90% sure this is deprecated
  @action
  createTrade(fromAsset, toAsset) {
    const selectedExchange = AssetStore.selectedExchangeAssetAllocation !== '' ?
      AssetStore.selectedExchangeAssetAllocation :
      'Manually Added';
    const today = new Date().toISOString().substring(0, 10);
    const newAssetAllocation = {
      selectedExchange,
      selectedDate: AssetStore.assetAllocationSelectedDate || today,
      fromCurrency: AssetStore.selectedCurrencyFromAssetAllocation.currency,
      portfolioId: this.selectedPortfolioId,
      fromAmount: AssetStore.assetAllocationFromAmount,
      toCurrency: AssetStore.selectedCurrencyToAssetAllocation,
      toAmount: AssetStore.assetAllocationToAmount,
      feeCurrency: AssetStore.selectedCurrencyForTransactionFee,
      feeAmount: AssetStore.assetAllocationFee,
    };
    let type = '';
    let price = 0;
    let filled = 0;
    let market = '';
    const tradingCoin = newAssetAllocation.toCurrency;
    switch (tradingCoin) {
      case 'BTC':
      case 'ETH':
      case 'USDT':
        type = 'sell';
        market = tradingCoin;
        price = newAssetAllocation.toAmount / newAssetAllocation.fromAmount;
        filled = newAssetAllocation.fromAmount;
        break;
      default:
        type = 'buy';
        market = newAssetAllocation.fromCurrency;
        price = newAssetAllocation.fromAmount / newAssetAllocation.toAmount;
        filled = newAssetAllocation.toAmount;
        break;
    }

    let dateOfEntry = null;
    if (newAssetAllocation.selectedDate) {
      dateOfEntry = new Date(newAssetAllocation.selectedDate).toISOString();
    } else {
      dateOfEntry = new Date().toISOString();
    }

    const trade = {
      dateOfEntry,
      source: newAssetAllocation.selectedExchange,
      pair: `${newAssetAllocation.fromCurrency}-${newAssetAllocation.toCurrency}`,
      fromAssetId: fromAsset.id,
      fromCurrency: fromAsset.currency,
      fromAmount: newAssetAllocation.fromAmount,
      toAssetId: toAsset.id,
      toCurrency: toAsset.currency,
      toAmount: newAssetAllocation.toAmount,
      type,
      price,
      filled,
      fee: newAssetAllocation.feeAmount,
      feeCurrency: newAssetAllocation.feeCurrency,
      totalPrice: price * filled,
      market,
      portfolioId: newAssetAllocation.portfolioId,
    };
    requester.Trade.addTrade(trade)
      .then((response) => {
        this.currentPortfolioTrades.push(response.data);
      });
  }

  @action.bound
  deleteTrade(trade) {
    const selectedExchange = AssetStore.selectedExchangeAssetAllocation !== '' ?
      AssetStore.selectedExchangeAssetAllocation :
      'Manually Added';
    const newAssetAllocation = {
      selectedExchange,
      selectedDate: trade.transactionDate,
      fromCurrency: trade.toCurrency,
      portfolioId: this.selectedPortfolioId,
      fromAmount: trade.toAmount,
      toCurrency: trade.fromCurrency,
      toAmount: trade.fromAmount,
      feeCurrency: trade.feeCurrency,
      feeAmount: trade.fee,
    };
    const tradeId = trade.id;
    console.log(newAssetAllocation);

    // NOTE: allocation request has update, create and delete.
    // That why it returns the updated assets for the current portfolio
    return requester.Asset.allocate(newAssetAllocation)
      .then(action((result) => {
        this.currentPortfolioAssets = result.data.assets;
        this.removeTrade(tradeId);
      }))
      .catch((error) => {
        console.log(error);
      });
  }
  @action
  removeTrade(id) {
    requester.Trade.deleteTrade(id)
      .then(action(() => {
        this.currentPortfolioTrades = this.currentPortfolioTrades.filter(trade => trade.id !== id);
      }))
      .catch(err => console.log(err));
  }

  @computed
  get groupedCurrentPortfolioAssets() {
    if (this.selectedPortfolio && this.currentPortfolioAssets.length > 0 &&
      MarketStore.baseCurrencies.length > 0 && MarketStore.marketSummaries.hasOwnProperty('BTC-ETH')) {
      const groupedAssets = Object.values(this.currentPortfolioAssets.reduce((grouped, asset) => {
        if (!grouped[asset.currency] && asset.balance > 0) {
          grouped[asset.currency] = Object.assign({}, asset); // eslint-disable-line no-param-reassign

          return grouped;
        }

        if (grouped[asset.currency]) {
          grouped[asset.currency].balance += Number(asset.balance); // eslint-disable-line no-param-reassign
          grouped[asset.currency].lastBTCEquivalent += Number(asset.lastBTCEquivalent); // eslint-disable-line no-param-reassign

          return grouped;
        }

        return grouped;
      }, {}));

      return groupedAssets;
    }

    return [];
  }

  @computed
  get summaryPortfolioAssets() {
    // NOTE: all the conditions needs to be fulfilled in order to create
    // portfolio asset summary
    debugger;
    if (this.selectedPortfolio &&
      this.currentPortfolioAssets.length > 0 &&
      FiatCurrenciesStore.fiatCurrencies.length > 0 &&
      MarketStore.marketSummaries.hasOwnProperty('BTC-ETH')) {
      const { marketPriceHistory } = MarketStore;
      const currentAssets = this.groupedCurrentPortfolioAssets;
      const valueOfUSD = FiatCurrenciesStore.fiatCurrencies[3].last; // NOTE: this if USD
      const selectedPortfolioSummary = [];

      // Creates the needed array, that will be shown in the view
      currentAssets.forEach((asset) => {
        const currentRow = [];
        Object.keys(asset).forEach((keyName, ind) => {
          // 1. Ticker
          if (keyName === 'currency') {
            currentRow.push(asset[keyName]);
          }
          // 2. Holdings
          if (keyName === 'balance') {
            currentRow.push(asset[keyName]);
          }
          // ------------------------------
          // Depends on array's 0 index
          let assetBTCEquiv;
          switch (true) {
            case currentRow[0] === 'BTC' && ind > 1:
              assetBTCEquiv = MarketStore.marketSummaries[`USDT-${currentRow[0]}`].Last;
              break;
            case currentRow[0] === 'USD' && ind > 1:
              assetBTCEquiv = 1 / MarketStore.baseCurrencies[3].last;
              break;
            case currentRow[0] === 'JPY' && ind > 1:
              assetBTCEquiv = 1 / MarketStore.baseCurrencies[2].last;
              break;
            case currentRow[0] === 'EUR' && ind > 1:
              assetBTCEquiv = 1 / MarketStore.baseCurrencies[1].last;
              break;
            case currentRow[0] === 'USDT' && ind > 1:
              assetBTCEquiv = 1 / MarketStore.marketSummaries['USDT-BTC'].Last;
              break;
            default:
              assetBTCEquiv = MarketStore.marketSummaries[`BTC-${currentRow[0]}`]
                ? MarketStore.marketSummaries[`BTC-${currentRow[0]}`].Last
                : 0;
              break;
          }

          // ------------------------------
          // 3. Price(BTC)
          if (ind === 2) {
            let calcPriceBTC;
            if (currentRow[0] === 'BTC') {
              calcPriceBTC = asset.balance;
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
            const calcPriceUSD = currentRow[3] * asset.balance;
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
              case 'EUR':
              case 'JPY':
                changeFromYesterday = 'n/a';
                break;
              case 'BTC':
                yesterdayCost = MarketStore.marketSummaries[`USDT-${currentRow[0]}`].PrevDay;
                changeFromYesterday = (((assetBTCEquiv - yesterdayCost) / yesterdayCost) * 100)
                  .toFixed(2);
                break;
              case 'USDT':
                yesterdayCost = 1 / MarketStore.marketSummaries['USDT-BTC'].PrevDay;
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
            switch (currentRow[0]) {
              case 'USD':
              case 'EUR':
              case 'JPY':
                currentRow.push('n/a');
                break;
              case 'BTC':
                currentRow.push(0);
                break;
              default:
                if (marketPriceHistory[currentRow[0]]) {
                  currentRow.push(marketPriceHistory[currentRow[0]].percentChangeFor7d);
                } else {
                  currentRow.push('n/a');
                }
                break;
            }
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
    if (this.selectedPortfolio && this.currentPortfolioAssets.length) {
      const totals = this.currentPortfolioAssets.map(asset => asset.totalUSD);
      return totals.reduce((accumulator, value) => accumulator + value);
    }
    return 0;

    // TODO FOR DELETE
    // if (this.selectedPortfolio && MarketStore.baseCurrencies.length > 0) {
    //   const valueOfUSD = MarketStore.baseCurrencies[3].last; // NOTE: this is USD
    //   return this.currentPortfolioAssets.reduce((accumulator, asset) => {
    //     let assetUSDValue;
    //     switch (asset.currency) {
    //       case 'JPY':
    //       case 'EUR':
    //       case 'USD': {
    //         const wantedCurrency = MarketStore.baseCurrencies.filter(x => x.pair === asset.currency)[0];
    //         assetUSDValue = (asset.balance / wantedCurrency.last) * valueOfUSD;
    //         break;
    //       }
    //       case 'BTC': {
    //         assetUSDValue = asset.balance * valueOfUSD;
    //         break;
    //       }
    //       default: {
    //         const assetBTCEquiv = MarketStore.marketSummaries[`BTC-${asset.currency}`]
    //           ? (MarketStore.marketSummaries[`BTC-${asset.currency}`].Last * asset.balance)
    //           : 0;
    //         assetUSDValue = assetBTCEquiv * valueOfUSD;
    //         break;
    //       }
    //     }
    //     return accumulator + assetUSDValue;
    //   }, 0);
    // }

    // return 0;
  }

  @computed
  get currentPortfolioSharePrice() {
    if (this.selectedPortfolio && this.selectedPortfolio.shares > 0) {
      return (this.currentPortfolioCostInUSD || 1) / (this.selectedPortfolio.shares);
    }
    return 0;
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
  @action.bound
  addTransaction(transactionData) {
    this.currentPortfolioTransactions.push(transactionData);
  }

  @action.bound
  setNewPortfolioName(newValue) {
    this.newPortfolioName = newValue;
  }

  @action.bound
  createPortfolio(placeCalled) {
    const newPortfolio = {
      name: this.newPortfolioName,
    };
    requester.Portfolio.create(newPortfolio)
      .then(action((result) => {
        InvestorStore.createDefaultInvestor(result.data);

        if (placeCalled === 'startScreen') {
          history.push('/summary');
        }
      }))
      .catch(err => console.log(err));
  }

  @action
  // eslint-disable-next-line class-methods-use-this
  handlePortfolioValidation() {
    const { newPortfolioName } = this;
    const { portfolios } = this;
    let hasErrors = false;
    if (portfolios.length) {
      const result = this.portfolios.filter(x => x.name === newPortfolioName);

      if (result.length > 0) {
        NotificationStore.addMessage('errorMessages', 'Portfolio Name already Exists');
        hasErrors = true;
      }
    }
    if (MarketStore.selectedBaseCurrency && InvestorStore.newInvestorValues.depositedAmount === '') {
      NotificationStore.addMessage('errorMessages', 'Please add investment amount');
      hasErrors = true;
    }

    if (InvestorStore.newInvestorValues.depositedAmount && MarketStore.selectedBaseCurrency === null) {
      NotificationStore.addMessage('errorMessages', 'Please select currency');
      hasErrors = true;
    }

    return hasErrors;
  }

  @action
  // eslint-disable-next-line class-methods-use-this
  updatePortfolio(portfolioName, id) {
    requester.Portfolio.update({ name: portfolioName }, id)
      .then(action(() => {
        this.portfolios = this.portfolios.map((portfl) => {
          if (portfl.id === id) {
            return Object.assign({}, portfl, { name: portfolioName });
          }
          return portfl;
        });
      }))
      .catch(err => console.log(err));
  }

  @action
  // eslint-disable-next-line class-methods-use-this
  removePortfolio(id) {
    requester.Portfolio.delete(id)
      .then(action((result) => {
        if (result.data === 1) {
          this.portfolios = this.portfolios.filter(el => el.id !== id);
        }

        this.selectPortfolio(this.portfolios[this.portfolios.length - 1].id);
      }))
      .catch(err => console.log(err));
  }
  // #endregion

  @action.bound
  selectPortfolio(id) {
    this.selectedPortfolioId = id;
    this.saveSelectedPortfolioId();
    this.selectedPortfolio = this.portfolios.find(porfolio => id === porfolio.id);
    if (this.selectedPortfolio) {
      this.getCurrentPortfolioAssets();
    }
    // FOR DELETE
    // InvestorStore.selectedInvestor = ''; // reset InvestorDetailsTable
    // if (id !== 0) {
    //   this.selectedPortfolioId = id;
    // }
    // if (this.portfolios.length) {
    //   this.portfolios.forEach((el) => {
    //     // Returns only needed values from selected portfolio
    //     if (el.id === id) {
    //       this.selectedPortfolio = { ...el };

    //       // removed eager loading and all data is separated
    //       this.getCurrentPortfolioAssets();
    //       this.getCurrentPortfolioPrices();
    //       this.getCurrentPortfolioInvestors();
    //       this.getCurrentPortfolioTrades();
    //       this.getCurrentPortfolioTransactions();
    //     }
    //   });
    //   InvestorStore.selectedInvestorIndividualSummary = null;
    //   // Analytics.btcPriceHistoryForPeriod();
    //   Analytics.getClosingSharePriceHistory();
    // }
  }

  @action
  getPortfolios() {
    this.fetchingPortfolios = true;
    return new Promise((resolve, reject) => {
      this.portfolios = []
      this.fetchingPortfolios = false;
      resolve(true);
      // TODO: Enable when we have portfolios
      // We dont have user at the moment. Uncoment when we have!
      // requester.Portfolio.getAll()
      //   .then(action((result) => {
      //     ApiAccountStore.initializeUserApis(result.data.userApis);
      //     this.portfolios = result.data.portfolios;
      //     if (this.selectedPortfolioId > 0) {
      //       this.selectPortfolio(this.selectedPortfolioId);
      //     }
      //     resolve(true);
      //     this.fetchingPortfolios = false;
      //   }))
      //   .catch(action((err) => {
      //     this.fethingPortfolios = false;
      //     console.log(err);
      //     reject(err);
      //   }));
    });
  }

  @action
  getPortfoliosOnStartup() {
    this.fetchingPortfolios = true;
    storage.getPortfolioAddresses()
      .then(action(data => new Promise((resolve, reject) => {
        requester.Portfolio.getPortfoliosByUserAddresses(data)
          .then(action((result) => {
            storage.setPortfolioAddresses(data);
            this.portfolios = result.data;
            if (this.selectedPortfolioId > 0) {
              this.selectPortfolio(this.selectedPortfolioId);
            }
            resolve(true);
            this.fetchingPortfolios = false;
          }))
          .catch(action((err) => {
            this.fethingPortfolios = false;
            console.log(err);
            reject(err);
          }));
      })));
  }

  @action
  getPortfoliosByAddresses(addresses) {
    this.fetchingPortfolios = true;
    requester.Portfolio.getPortfoliosByUserAddresses(addresses)
      .then(action((result) => {
        storage.setPortfolioAddresses(addresses);
        this.portfolios = result.data;
        if (this.selectedPortfolioId > 0) {
          this.selectPortfolio(this.selectedPortfolioId);
        }
        this.fetchingPortfolios = false;
      }))
      .catch(action((err) => {
        this.fethingPortfolios = false;
        console.log(err);
      }));
  }

  @action
  saveSelectedPortfolioId() {
    storage.setSelectedPortfolioId(this.selectedPortfolioId);
  }

  @action.bound
  getCurrentPortfolioAssets() {
    // TODO FOR DELETE
    // const searchedItem = {
    //   portfolioId: this.selectedPortfolioId,
    //   item: 'Asset',
    // };
    requester.Portfolio.getPortfolioAssetsByPortfolioId(this.selectedPortfolio.id)
      .then(action((result) => {
        this.currentPortfolioAssets = result.data;
      }));
  }

  @action.bound
  getCurrentPortfolioPrices() {
    const searchedItem = {
      portfolioId: this.selectedPortfolioId,
      item: 'PortfolioPrice',
    };
    requester.Portfolio.searchItemsInCurrentPortfolio(searchedItem)
      .then(action((result) => {
        this.currentPortfolioPrices = result.data;
      }));
  }

  @action.bound
  getCurrentPortfolioInvestors() {
    const searchedItem = {
      portfolioId: this.selectedPortfolioId,
      item: 'Investor',
    };
    requester.Portfolio.searchItemsInCurrentPortfolio(searchedItem)
      .then(action((result) => {
        this.currentPortfolioInvestors = result.data;
      }));
  }

  @action.bound
  getCurrentPortfolioTransactions() {
    const searchedItem = {
      portfolioId: this.selectedPortfolioId,
      item: 'Transaction',
    };
    requester.Portfolio.searchItemsInCurrentPortfolio(searchedItem)
      .then(action((result) => {
        // console.log(result.data);
        this.currentPortfolioTransactions = result.data;
      }));
  }

  @action.bound
  getCurrentPortfolioTrades() {
    const searchedItem = {
      portfolioId: this.selectedPortfolioId,
      item: 'Trade',
    };
    requester.Portfolio.searchItemsInCurrentPortfolio(searchedItem)
      .then(action((result) => {
        this.currentPortfolioTrades = result.data.tradeHistory;
        this.currentPortfolioApiTradeHistory = result.data.apiTradeHistory;
      }));
  }

  @action.bound
  resetPortfolio() {
    this.newPortfolioName = '';
  }
}

export default new PortfolioStore();
