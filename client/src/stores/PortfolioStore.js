// @flow
/* eslint no-console: 0 */
/* eslint no-prototype-builtins: 0 */

import {
  observable,
  action,
  computed,
  onBecomeObserved,
} from 'mobx';
import math from 'mathjs';
import requester from '../services/requester';
import MarketStore from './MarketStore';
import InvestorStore from './InvestorStore';
import NotificationStore from './NotificationStore';
import AssetStore from './AssetStore';
import history from '../services/History';
import storage from '../services/storage';
import BigNumberService from '../services/BigNumber';
import LoadingStore from './LoadingStore';
import TransactionStore from './TransactionStore';

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
  @observable portfolioValueHistory;
  @observable portfolioValueHistoryByPeriod;
  @observable standardDeviationPeriod;
  @observable alphaData;

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
    this.portfolioValueHistory = [];
    this.portfolioValueHistoryByPeriod = [];
    this.standardDeviationPeriod = null;
    this.alphaData = null;

    // only start data fetching if those properties are actually used!
    onBecomeObserved(this, 'currentPortfolioAssets', this.getCurrentPortfolioAssets);
    onBecomeObserved(this, 'currentPortfolioInvestors', this.getCurrentPortfolioInvestors);
    onBecomeObserved(this, 'currentPortfolioTransactions', this.getCurrentPortfolioTransactions);
    onBecomeObserved(this, 'currentPortfolioTrades', this.getCurrentPortfolioTrades);
    onBecomeObserved(this, 'currentPortfolioPrices', this.getCurrentPortfolioPrices);
    onBecomeObserved(this, 'portfolioValueHistory', this.getPortfolioValueHistory);
    onBecomeObserved(this, 'portfolioValueHistoryByPeriod', this.getPortfolioValueHistoryByPeriod);
  }

  @action.bound
  getPortfolioValueHistory() {
    requester.Portfolio.getPortfolioValueHistory(this.selectedPortfolioId)
      .then(action((result: object) => {
        this.portfolioValueHistory = result.data;
      }));
  }

  @action.bound
  getPortfolioValueHistoryByPeriod() {
    requester.Portfolio.getPortfolioValueHistoryByPeriod(this.selectedPortfolioId, 'w')
      .then(action((result: object) => {
        this.portfolioValueHistoryByPeriod = result.data;
      }));
  }

  @computed
  get portfolueValueLastDay() {
    if (this.portfolioValueHistoryByPeriod.length && this.portfolioValueHistoryByPeriod.length > 0) {
      return Number(BigNumberService.toFixedParam(
        BigNumberService.product(
          BigNumberService.quotient(
            BigNumberService.difference(
              this.portfolioValueHistoryByPeriod[0].usd,
              this.portfolioValueHistoryByPeriod[1].usd,
            ),
            this.portfolioValueHistoryByPeriod[0].usd,
          ),
          100,
        ),
        2,
      ));
    }
    return 0;
  }

  @computed
  get portfolueValueLastWeek() {
    if (this.portfolioValueHistoryByPeriod.length && this.portfolioValueHistoryByPeriod.length > 0) {
      return Number(BigNumberService.toFixedParam(
        BigNumberService.product(
          BigNumberService.quotient(
            BigNumberService.difference(
              this.portfolioValueHistoryByPeriod[0].usd,
              this.portfolioValueHistoryByPeriod[this.portfolioValueHistoryByPeriod.length - 1].usd,
            ),
            this.portfolioValueHistoryByPeriod[0].usd,
          ),
          100,
        ),
        2,
      ));
    }
    return 0;
  }

  @computed
  get totalAssetsValue() {
    if (this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0) {
      return this.portfolioValueHistory
        .map((item: object) =>
          ([
            Number(new Date(item.timestamp).getTime()),
            Number(BigNumberService.toFixedParam(BigNumberService.gweiToEth(item.eth), 4)),
          ]));
    }
    return [];
  }

  @computed
  get performanceMin() {
    if (this.selectedPortfolio && this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0) {
      const arr = this.portfolioValueHistory.map((el: Object) => el.usd);
      return Math.min(...arr).toFixed(2);
    }
    return 0;
  }

  @computed
  get performanceMax() {
    if (this.selectedPortfolio && this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0) {
      const arr = this.portfolioValueHistory.map((el: Object) => el.usd);
      return Math.max(...arr).toFixed(2);
    }
    return 0;
  }

  @computed
  get totalAssetsValueUSD() {
    if (this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0) {
      return this.portfolioValueHistory
        .map((item: object) =>
          ([
            Number(new Date(item.timestamp).getTime()),
            Number(BigNumberService.toFixedParam(item.usd, 2)),
          ]));
    }
    return [];
  }

  @computed
  get portfolioValueHistoryBreakdownDates() {
    if (this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0) {
      return this.portfolioValueHistory
        .map((el: object) => {
          const date = new Date(el.timestamp);
          let month = date.getUTCMonth() + 1;
          if (month.length === 1) {
            month = `0${month}`;
          }
          return `${date.getDate()}-${month}-${date.getFullYear()}`;
        });
    }
    return [];
  }

  @computed
  get portfolioValueHistoryBreakdownPercents() {
    if (this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0) {
      return this.portfolioValueHistory
        .map((el: object, i: number) => {
          if (i !== 0) {
            return Number(BigNumberService.toFixedParam(
              BigNumberService.product(
                BigNumberService.quotient(
                  BigNumberService.difference(
                    this.portfolioValueHistory[i].eth,
                    this.portfolioValueHistory[i - 1].eth,
                  ),
                  this.portfolioValueHistory[i - 1].eth,
                ),
                100,
              ),
              2,
            ));
          } else {
            return 100;
          }
        });
    }
    return [];
  }

  @computed
  get portfolioValueHistoryUsdBreakdownPercents() {
    if (this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0) {
      return this.portfolioValueHistory
        .map((el: object, i: number) => {
          if (i !== 0) {
            return Number(BigNumberService.toFixedParam(
              BigNumberService.product(
                BigNumberService.quotient(
                  BigNumberService.difference(
                    this.portfolioValueHistory[i].usd,
                    this.portfolioValueHistory[i - 1].usd,
                  ),
                  this.portfolioValueHistory[i - 1].usd,
                ),
                100,
              ),
              2,
            ));
          } else {
            return 100;
          }
        });
    }
    return [];
  }

  @computed
  get standardDeviation() {
    if (this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0 && this.standardDeviationPeriod) {
      const portfolioValueHistoryArr = this.portfolioValueHistory.length > 30 ?
        this.portfolioValueHistory.slice(Math.max(this.portfolioValueHistory.length - this.standardDeviationPeriod, 1)) :
        this.portfolioValueHistory;
      this.standardDeviationData = portfolioValueHistoryArr.map((el: object) => el.eth);
      return Number(BigNumberService
        .toFixedParam(BigNumberService
          .gweiToEth(math.std(this.standardDeviationData)), 2));
    }
    return null;
  }

  @action.bound
  setStandardDeviationPeriod(period: number) {
    this.standardDeviationPeriod = period;
  }

  @computed
  get currentPortfolioSharePrice() {
    if (this.selectedPortfolio && TransactionStore.transactions.length > 0) {
      return Number(BigNumberService
        .toFixedParam(BigNumberService
          .quotient(this.currentPortfolioCostInUSD, TransactionStore.numOfShares), 2));
    }
    return 0;
  }

  @computed
  get currentPortfolioCostInUSD() {
    if (this.currentPortfolioAssets.length && this.currentPortfolioAssets.length > 0) {
      return BigNumberService.toFixedParam((this.currentPortfolioAssets
        .reduce((acc: number, obj: number) => BigNumberService.sum(acc, obj.totalUSD), 0)), 2);
    }
    return 0;
  }

  @computed
  get summaryTotalInvestmentInUSD() {
    if (this.selectedPortfolio) {
      return Number(BigNumberService.toFixedParam(this.selectedPortfolio.totalInvestmentUSD, 2));
    }
    return 0;
  }

  @computed
  get summaryTotalProfitLoss() {
    if (this.selectedPortfolio && TransactionStore.transactions.length > 0 && this.selectedPortfolio.totalInvestmentUSD !== 0) {
      return Number(BigNumberService.toFixedParam(
        BigNumberService.product(
          BigNumberService.quotient(
            BigNumberService.difference(
              this.currentPortfolioCostInUSD,
              this.selectedPortfolio.totalInvestmentUSD,
            ),
            this.selectedPortfolio.totalInvestmentUSD,
          ),
          100,
        ),
        2,
      ));
    }
    return 0;
  }

  @computed
  get summaryTotalProfitLossUsd() {
    if (this.selectedPortfolio && this.portfolioValueHistory.length > 0 && this.selectedPortfolio.totalInvestmentUSD !== 0) {
      return Number(BigNumberService.toFixedParam(
        BigNumberService.difference(
          this.portfolioValueHistory[this.portfolioValueHistory.length - 1].usd,
          this.selectedPortfolio.totalInvestmentUSD,
        ),
        2,
      ));
    }
    return 0;
  }

  @computed
  get avgChange() {
    if (this.selectedPortfolio && TransactionStore.transactions.length > 0 && this.selectedPortfolio.totalInvestmentUSD !== 0) {
      return Number(BigNumberService.toFixedParam(
        BigNumberService.quotient(BigNumberService.product(
          BigNumberService.quotient(
            BigNumberService.difference(
              this.currentPortfolioCostInUSD,
              this.selectedPortfolio.totalInvestmentUSD,
            ),
            this.selectedPortfolio.totalInvestmentUSD,
          ),
          100,
        ), this.portfolioValueHistory.length),
        2,
      ));
    }
    return 0;
  }

  @action.bound
  getAlphaData(period: number, benchmark: string) {
    if (this.selectedPortfolioId !== null && this.selectedPortfolioId !== undefined) {
      LoadingStore.setShowLoading(true);
      requester.Portfolio.getAlpha(this.selectedPortfolioId, period, benchmark)
        .then(action((result: Object) => {
          this.alphaData = result.data;
          LoadingStore.setShowLoading(false);
        }))
        .catch(action((error: Object) => {
          console.log(error);
          this.alphaData = null;
          LoadingStore.setShowLoading(false);
        }));
    }
    return null;
  }

  @computed
  get portfolioAlpha() {
    if (this.selectedPortfolioId !== null && this.selectedPortfolioId !== undefined && this.alphaData !== null) {
      const ethValue = BigNumberService.product(
        BigNumberService.quotient(
          BigNumberService.difference(
            this.alphaData[1].ethUsd,
            this.alphaData[0].ethUsd,
          ),
          this.alphaData[0].ethUsd,
        ),
        100,
      );
      const sharePrice = BigNumberService.product(
        BigNumberService.quotient(
          BigNumberService.difference(
            this.alphaData[1].sharePrice,
            this.alphaData[0].sharePrice,
          ),
          this.alphaData[0].sharePrice,
        ),
        100,
      );
      return Number(BigNumberService.toFixedParam(
        BigNumberService.difference(
          sharePrice,
          ethValue,
        ),
        2,
      ));
    }
    return 0;
  }

  @action
  setFetchingPortfolios(value: boolean) {
    this.fethingPortfolios = value;
  }
  // ======= Computed =======
  // #region Computed
  // #region Summary Page
  @computed
  get summaryTotalNumberOfShares() {
    return 0;
  }

  @computed
  get summaryTotalInvestmentInETH() {
    if (this.selectedPortfolio) {
      return this.selectedPortfolio.totalInvestmentETH;
    }
    return 0;
  }

  @action
  sync = (addresses: Array<string>) => {
    requester.Weidex.sync(addresses)
      .then(() => {
        this.getPortfoliosByAddresses(addresses);
      })
      .catch((err: object) => {
        console.log(err);
        LoadingStore.setShowContent(true);
      });
  };

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

  // FOR DELETE
  // @computed
  // get summaryPortfolioAssets() {
  //   // NOTE: all the conditions needs to be fulfilled in order to create
  //   // portfolio asset summary
  //   // debugger;
  //   if (this.selectedPortfolio &&
  //     this.currentPortfolioAssets.length > 0 &&
  //     FiatCurrenciesStore.fiatCurrencies.length > 0 ) {
  //     const { marketPriceHistory } = MarketStore;
  //     const currentAssets = this.groupedCurrentPortfolioAssets;
  //     const selectedPortfolioSummary = [];

  //     // Creates the needed array, that will be shown in the view
  //     currentAssets.forEach((asset) => {
  //     });

  //     return selectedPortfolioSummary;
  //   }

  //   return [];
  // }
  // #endregion

  // used !!!
  @computed
  get currentMarketSummaryPercentageChange() {
    if (this.selectedPortfolio) {
      const marketSummary = MarketStore.marketPriceHistory;

      return Object.keys(marketSummary)
        .map((el: Object) => {
          const name = marketSummary[el].currency;
          const change24h = marketSummary[el].percentChangeFor24h;
          const change7d = marketSummary[el].percentChangeFor7d;
          return [name, change24h, change7d];
        })
        .sort((a: number, b: number) => b[1] - a[1]);
    }

    return [];
  }

  get summaryAssetsBreakdown() {
    return this.currentPortfolioAssets.map((el: object) => ({
      y: Number(BigNumberService.toFixedParam(el.weight, 2)),
      name: `${el.tokenName} ${Number(BigNumberService.toFixedParam(el.weight, 2))}%`,
    }));
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
  selectPortfolio(id: number) {
    this.selectedPortfolio = this.portfolios.find((porfolio: object) => id === porfolio.id);
    if (this.selectedPortfolioId !== id) {
      this.selectedPortfolioId = id;
      this.saveSelectedPortfolioId();
      this.getCurrentPortfolioAssets();
      this.getCurrentPortfolioTrades();
      TransactionStore.getTransactions();
      this.getPortfolioValueHistory();
      MarketStore.getTickersFromCoinMarketCap();
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
    // this.fetchingPortfolios = true;
    return new Promise((resolve, reject) => {
      this.portfolios = []
      // this.fetchingPortfolios = false;
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
  getPortfoliosByAddresses(addresses: Array<string>) {
    this.setFetchingPortfolios(true);
    requester.Portfolio.getPortfoliosByUserAddresses(addresses)
      .then(action((result: object) => {
        storage.setPortfolioAddresses(addresses);
        this.portfolios = result.data;
        if (this.selectedPortfolioId > 0) {
          this.selectPortfolio(this.selectedPortfolioId);
        }
        this.setFetchingPortfolios(false);
        LoadingStore.setShowContent(true);
      }))
      .catch(action((err: object) => {
        LoadingStore.setShowContent(true);
        this.setFetchingPortfolios(false);
        console.log(err);
      }));
  }

  @action
  saveSelectedPortfolioId() {
    storage.setSelectedPortfolioId(this.selectedPortfolioId);
  }

  @action.bound
  getCurrentPortfolioAssets() {
    if (this.selectedPortfolio) {
      action(() => {
        LoadingStore.setShowLoading(true);
      });
      requester.Portfolio.getPortfolioAssetsByPortfolioId(this.selectedPortfolio.id)
        .then(action((result: object) => {
          this.currentPortfolioAssets = result.data.filter((asset: object) => asset.balance > 0);
          LoadingStore.setShowLoading(false);
        }))
        .catch(action((err: object) => {
          console.log(err);
          LoadingStore.setShowLoading(false);
        }));
    }
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
    if (this.selectedPortfolioId !== null && this.selectedPortfolioId !== undefined) {
      requester.Investor.getAllInvestors(this.selectedPortfolioId)
        .then(action((result: Object) => {
          this.currentPortfolioInvestors = result.data;
        }));
    }
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
    action(() => {
      LoadingStore.setShowLoading(true);
    });
    requester.Portfolio.getPortfolioTradesByPortfolioId(this.selectedPortfolioId)
      .then(action((result: object) => {
        this.currentPortfolioTrades = result.data;
        LoadingStore.setShowLoading(false);
      }))
      .catch(action((err: object) => {
        console.log(err);
        LoadingStore.setShowLoading(false);
      }));
  }

  @action.bound
  resetPortfolio() {
    this.newPortfolioName = '';
  }
}

export default new PortfolioStore();
