// @flow
/* eslint no-console: 0 */
/* eslint no-prototype-builtins: 0 */

import {
  observable,
  action,
  computed,
  onBecomeObserved,
} from 'mobx';
import moment from 'moment';
import requester from '../services/requester';
import MarketStore from './MarketStore';
import NotificationStore from './NotificationStore';
import storage from '../services/storage';
import BigNumberService from '../services/BigNumber';
import LoadingStore from './LoadingStore';
import TransactionStore from './TransactionStore';
import AssetStore from './AssetStore';
import Allocations from './Allocations';
import Statistic from '../services/Statistic';
import Analytics from './Analytics';
import InvestorStore from './InvestorStore';
import CurrencyStore from './CurrencyStore';

// TODO handle if selected_portfolio_id has no set parameter
let persistedUserData = 0;

try {
  persistedUserData = JSON.parse(window.localStorage.getItem('selected_portfolio_id')); // eslint-disable-line
} catch (error) {
  console.log(error.stack);
}


class PortfolioStore {
  @observable portfolios;
  @observable selectedPortfolio;
  @observable selectedPortfolioId;
  @observable currentPortfolioAssets;
  @observable currentPortfolioInvestors;
  @observable currentPortfolioTrades;
  @observable portfolioValueHistory;
  @observable portfolioValueHistoryByPeriod;
  @observable standardDeviationPeriod;
  @observable sharesHistory;
  @observable allPortfoliosData;
  @observable stats;

  constructor() {
    this.portfolios = [];
    this.selectedPortfolio = null;
    this.selectedPortfolioId = persistedUserData;
    this.currentPortfolioAssets = [];
    this.currentPortfolioInvestors = [];
    this.currentPortfolioTrades = [];
    this.portfolioValueHistory = [];
    this.portfolioValueHistoryByPeriod = [];
    this.standardDeviationPeriod = null;
    this.sharesHistory = [];
    this.allPortfoliosData = [];
    this.stats = [];

    // only start data fetching if those properties are actually used!
    onBecomeObserved(this, 'currentPortfolioInvestors', this.getCurrentPortfolioInvestors);
    onBecomeObserved(this, 'stats', this.getPortfoliosStats);
    onBecomeObserved(this, 'portfolioValueHistoryByPeriod', this.getPortfolioValueHistoryByPeriod);
  }

  @action.bound
  getPortfolioValueHistory() {
    if (this.selectedPortfolioId !== null && this.selectedPortfolioId > 0) {
      requester.Portfolio.getPortfolioValueHistory(this.selectedPortfolioId)
        .then(action((result: object) => {
          this.portfolioValueHistory = result.data;
        }));
    } else {
      this.portfolioValueHistory = [];
    }
  }

  @action.bound
  getPortfoliosStats() {
    storage.getPortfolioAddresses().then((data: Object) => {
      if (data && data.length > 0) {
        requester.Portfolio.getPortfoliosStats(data)
          .then(action((result: object) => {
            this.stats = result.data;
          }))
          .catch(() => {
            this.portfolioValueHistory = [];
          });
      } else {
        this.portfolioValueHistory = [];
      }
    });
  }

  @action.bound
  getPortfolioValueHistoryByPeriod() {
    if (this.selectedPortfolioId !== null) {
      requester.Portfolio.getPortfolioValueHistoryByPeriod(this.selectedPortfolioId, 'w')
        .then(action((result: object) => {
          this.portfolioValueHistoryByPeriod = result.data;
        }));
    } else {
      this.portfolioValueHistoryByPeriod = [];
    }
  }

  @action.bound
  getShareHistory() {
    if (this.selectedPortfolioId !== null) {
      requester.Portfolio.getShareHistory(this.selectedPortfolioId)
        .then((result: Object) => {
          this.sharesHistory = result.data;
        })
        .catch((err: object) => console.log(err));
    }

    this.sharesHistory = [];
  }

  @computed
  get sharePriceBreakdownDates() {
    if (this.sharesHistory.length) {
      const result = [];
      this.sharesHistory.forEach((item: Object) => {
        result.push(moment(new Date(item.timestamp)).format('DD/MM/YYYY'));
      });
      return result;
    }

    return [];
  }

  @computed
  get sharePriceBreakdownShares() {
    if (this.sharesHistory.length > 0 && this.portfolioValueHistory.length > 0) {
      const result = [];
      this.sharesHistory.forEach((item: Object) => {
        this.portfolioValueHistory.forEach((pItem: Object) => {
          if (item.timestamp === pItem.timestamp) {
            result.push(Number(BigNumberService.floor(BigNumberService.quotient(pItem.usd, item.shares))));
          }
        });
      });
      return result;
    }

    return [];
  }

  @computed
  get sharePriceBreakdownSharesETH() {
    if (this.sharesHistory.length > 0 && this.portfolioValueHistory.length > 0) {
      const result = [];
      this.sharesHistory.forEach((item: Object) => {
        this.portfolioValueHistory.forEach((pItem: Object) => {
          if (item.timestamp === pItem.timestamp) {
            result.push(Number(BigNumberService.quotient(pItem.eth, item.shares)));
          }
        });
      });
      return result;
    }

    return [];
  }

  @computed
  get portfolueValueLastDay() {
    if (this.portfolioValueHistoryByPeriod.length && this.portfolioValueHistoryByPeriod.length > 0) {
      return Number(BigNumberService.product(
        BigNumberService.quotient(
          BigNumberService.difference(
            this.portfolioValueHistoryByPeriod[0].usd,
            this.portfolioValueHistoryByPeriod[1].usd,
          ),
          this.portfolioValueHistoryByPeriod[0].usd,
        ),
        100,
      ));
    }

    return 0;
  }

  @computed
  get portfolueValueLastWeek() {
    if (this.portfolioValueHistoryByPeriod.length && this.portfolioValueHistoryByPeriod.length > 0) {
      return Number(BigNumberService.product(
        BigNumberService.quotient(
          BigNumberService.difference(
            this.portfolioValueHistoryByPeriod[0].usd,
            this.portfolioValueHistoryByPeriod[this.portfolioValueHistoryByPeriod.length - 1].usd,
          ),
          this.portfolioValueHistoryByPeriod[0].usd,
        ),
        100,
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
            Number(BigNumberService.floorFour(BigNumberService.gweiToEth(item.eth))),
          ]));
    }

    return [];
  }

  @computed
  get totalAssetsValueUSD() {
    if (this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0) {
      return this.portfolioValueHistory
        .map((item: object) =>
          ([
            Number(new Date(item.timestamp).getTime()),
            Number(BigNumberService.floor(item.usd)),
          ]));
    }

    return [];
  }

  @computed
  get performanceMin() {
    if (this.selectedPortfolio && this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0) {
      const arr = this.portfolioValueHistory.map((el: Object) => el.usd);
      return BigNumberService.floor(Math.min(...arr));
    }

    return 0;
  }

  @computed
  get performanceMax() {
    if (this.selectedPortfolio && this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0) {
      const arr = this.portfolioValueHistory.map((el: Object) => el.usd);
      return BigNumberService.floor(Math.max(...arr));
    }

    return 0;
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
            return Number(BigNumberService.floor(BigNumberService.product(
              BigNumberService.quotient(
                BigNumberService.difference(
                  this.portfolioValueHistory[i].eth,
                  this.portfolioValueHistory[i - 1].eth,
                ),
                this.portfolioValueHistory[i - 1].eth,
              ),
              100,
            )));
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
            return Number(BigNumberService.floor(BigNumberService.product(
              BigNumberService.quotient(
                BigNumberService.difference(
                  this.portfolioValueHistory[i].usd,
                  this.portfolioValueHistory[i - 1].usd,
                ),
                this.portfolioValueHistory[i - 1].usd,
              ),
              100,
            )));
          } else {
            return 100;
          }
        });
    }
    return [];
  }

  @computed
  get standardDeviation() {
    if (this.portfolioValueHistory.length !== 0) {
      return Number(BigNumberService.product(BigNumberService.sqrt(this.portfolioVariance), 100));
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
      return Number(BigNumberService.quotient(this.currentPortfolioCostInUSD, TransactionStore.numOfShares));
    }

    return 0;
  }

  @computed
  get currentPortfolioCostInUSD() {
    if (this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0) {
      return this.portfolioValueHistory[this.portfolioValueHistory.length - 1].usd;
    }

    return 0;
  }

  @computed
  get currentPortfolioCostInETH() {
    if (this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0) {
      return this.portfolioValueHistory[this.portfolioValueHistory.length - 1].eth;
    }

    return 0;
  }

  @computed
  get summaryTotalInvestmentInUSD() {
    if (this.selectedPortfolio) {
      return Number(this.selectedPortfolio.totalInvestmentUSD);
    }

    return 0;
  }

  @computed
  get portfolioVariance() {
    if (this.selectedPortfolio && this.currentPortfolioAssets && this.currentPortfolioAssets.length &&
      AssetStore.assetsValueHistory && AssetStore.assetsValueHistory.length) {
      const data = AssetStore.assetsValueHistory.map((item: Object) => item);
      const assets = data[data.length - 1].assets.filter((asset: Object) => asset.amount > 0);

      // assume that there is only ETH and USD
      const benchmarkData = Analytics.riskCurrency === 'ETH' ?
        MarketStore.ethHistory.map(() => 1) :
        MarketStore.ethHistory.map((item: Object) => item.priceUsd);

      // If data starts with 0 (no records);
      const assetsTotalStartIndex = data.findIndex((item: Object) => item !== 0);
      if (assetsTotalStartIndex > 0) {
        data.splice(0, assetsTotalStartIndex);
      }

      // Slice data according selected period
      if (data.length > Analytics.riskPeriod + 1) {
        const startIdx = data.length - (Analytics.riskPeriod + 1);
        data.splice(0, startIdx);
      }

      const items = assets.map((asset: Object) => asset.tokenName).sort();
      const result = items.map((item: string) => {
        let assetTotals = [];
        // assume that there is only ETH and USD
        if (Analytics.riskCurrency === 'ETH') {
          assetTotals = data.map((el: Object) => el.assets.filter((asset: Object) => asset.tokenName === item)[0].price);
        } else {
          assetTotals = data.map((el: Object, index: number) =>
            BigNumberService.product(el.assets.filter((asset: Object) => asset.tokenName === item)[0].price, benchmarkData[index]));
        }
        const { weight } = this.currentPortfolioAssets.filter((ast: Object) => ast.tokenName === item)[0];
        return { tokenName: item, data: assetTotals, weight: BigNumberService.quotient(weight, 100) };
      });

      return Statistic.getPortfolioVariance(result);
    }

    return 0;
  }

  @computed
  get portfolioBeta() {
    if (this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0 &&
      AssetStore.assetsVariance.length && AssetStore.assetsVariance.length > 0) {
      const data = AssetStore.assetsVariance.map((item: Object) =>
        // Change when new benchmarks are added
        ({ beta: item.beta, value: Analytics.riskCurrency === 'ETH' ? item.totalEth : item.totalUsd }));
      const totalWeight = Analytics.riskCurrency === 'ETH' ? this.currentPortfolioCostInETH : this.currentPortfolioCostInUSD;
      return Statistic.getPortfolioBeta(totalWeight, data);
    }

    return 0;
  }

  @computed
  get portfolioAlpha() {
    if (this.portfolioValueHistory.length && this.portfolioValueHistory.length > 0 &&
      MarketStore.ethHistory.length && MarketStore.ethHistory.length > 0) {
      // Change when new benchmarks are added
      const benchmarkData = Analytics.riskCurrency === 'ETH' ?
        MarketStore.ethHistory.map(() => 1) :
        MarketStore.ethHistory.map((item: Object) => item.priceUsd);
      // Change when new benchmarks are added
      const data = Analytics.riskCurrency === 'ETH' ?
        this.sharePriceBreakdownSharesETH.map((item: number) => Number(BigNumberService.tokenToEth(item, 18))) :
        this.sharePriceBreakdownShares.map((item: number) => item);

      // If data is shorter than benchmark data
      if (data.length < benchmarkData.length) {
        const rem = benchmarkData.length - data.length;
        benchmarkData.splice(rem, data.length);
      }

      // Slice data according selected period
      if (data.length > Analytics.riskPeriod) {
        const startIdx = data.length - Analytics.riskPeriod;
        data.splice(0, startIdx);
        benchmarkData.splice(0, startIdx);
      }
      return Statistic.getAlpha(benchmarkData, data);
    }

    return 0;
  }

  @computed
  get summaryTotalProfitLoss() {
    if (this.selectedPortfolio && TransactionStore.transactions.length > 0 && this.selectedPortfolio.totalInvestmentUSD !== 0) {
      return Number(BigNumberService.product(
        BigNumberService.quotient(
          BigNumberService.difference(
            this.currentPortfolioCostInUSD,
            this.selectedPortfolio.totalInvestmentUSD,
          ),
          this.selectedPortfolio.totalInvestmentUSD,
        ),
        100,
      ));
    }
    return 0;
  }

  @computed
  get summaryTotalProfitLossUsd() {
    if (this.selectedPortfolio && this.portfolioValueHistory.length > 0 && this.selectedPortfolio.totalInvestmentUSD !== 0) {
      return Number(BigNumberService.difference(
        this.portfolioValueHistory[this.portfolioValueHistory.length - 1].usd,
        this.selectedPortfolio.totalInvestmentUSD,
      ));
    }
    return 0;
  }

  @computed
  get avgChange() {
    if (this.selectedPortfolio && TransactionStore.transactions.length > 0 && this.selectedPortfolio.totalInvestmentUSD !== 0) {
      return Number(BigNumberService.quotient(BigNumberService.product(
        BigNumberService.quotient(
          BigNumberService.difference(
            this.currentPortfolioCostInUSD,
            this.selectedPortfolio.totalInvestmentUSD,
          ),
          this.selectedPortfolio.totalInvestmentUSD,
        ),
        100,
      ), this.portfolioValueHistory.length));
    }
    return 0;
  }

  @action
  sync = (addresses: Array<string>) => {
    LoadingStore.setShowLoading(true);
    LoadingStore.setSyncing(true);
    requester.Weidex.sync(addresses)
      .then(() => {
        LoadingStore.setShowLoading(false);
        LoadingStore.setSyncing(false);
        this.getPortfoliosByAddresses(addresses);
      })
      .catch((err: object) => {
        console.log(err);
        LoadingStore.setShowLoading(false);
        LoadingStore.setShowContent(true);
        LoadingStore.setSyncing(false);
      });
  };

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

  @computed
  get summaryAssetsBreakdown() {
    return this.currentPortfolioAssets.map((el: object) => ({
      y: Number(BigNumberService.floor(el.weight)),
      name: `${el.tokenName} ${Number(BigNumberService.floor(el.weight))}%`,
    }));
  }

  @computed
  get currentPortfolioInvestorsCount() {
    if (this.selectedPortfolio) {
      return this.currentPortfolioInvestors.length;
    }

    return 0;
  }

  @action
  updatePortfolio(portfolioName: string, id: number) {
    requester.Portfolio.setName({ portfolioName }, id)
      .then(action(() => {
        this.portfolios = this.portfolios.map((item: Object) => {
          if (item.id === id) {
            return Object.assign({}, item, { name: portfolioName, portfolioName });
          }
          return item;
        });
        this.allPortfoliosData = this.allPortfoliosData.map((item: Object) => {
          if (item[5] === id) {
            return Object.assign([], item, { 4: portfolioName, 0: portfolioName });
          }
          return item;
        });
        NotificationStore.addMessage('successMessages', 'Portfolio renamed successfully!');
      }))
      .catch((err: Object) => {
        NotificationStore.addMessage('errorMessages', 'Unable to rename portfolio');
        console.log(err.response.data.message);
      });
  }

  @action.bound
  selectPortfolio(id: number, loadData: boolean) {
    this.selectedPortfolio = this.portfolios.find((porfolio: object) => id === porfolio.id);
    if (this.selectedPortfolioId !== id) {
      this.selectedPortfolioId = id;
      this.saveSelectedPortfolioId();
    }
    if (loadData) {
      this.loadData();
    }
  }

  @action
  loadData() {
    this.getPortfolioValueHistory();
    this.getCurrentPortfolioAssets();
    this.getCurrentPortfolioTrades();
    CurrencyStore.getCurrencies();
    TransactionStore.getTransactions();
    MarketStore.getTickersFromCoinMarketCap();
    MarketStore.getEthHistory();
    AssetStore.getAssetsValueHistory();
    this.getShareHistory();
    Allocations.getAllocations();
    this.getCurrentPortfolioInvestors();
    InvestorStore.resetSelectedInvestor();
  }
  // @action
  // getPortfolios() {        
  //   this.fetchingPortfolios = true;
  //   return new Promise((resolve, reject) => {
  //     console.log('weee');
  //     requester.Portfolio.getAll()
  //       .then(action((result) => {
  //         ApiAccountStore.initializeUserApis(result.data.userApis);
  //         this.portfolios = result.data.portfolios;
  //         if (this.selectedPortfolioId > 0) {
  //           this.selectPortfolio(this.selectedPortfolioId);
  //         }
  //         resolve(true);
  //         this.fetchingPortfolios = false;
  //       }))
  //       .catch(action((err) => {
  //         this.fethingPortfolios = false;
  //         console.log(err);
  //         reject(err);
  //       }));
  //   });
  // }

  @action
  getPortfoliosByAddresses(addresses: Array<string>) {
    requester.Portfolio.getPortfoliosByUserAddresses(addresses)
      .then(action((result: object) => {
        storage.setPortfolioAddresses(addresses);
        this.portfolios = result.data;
        LoadingStore.setShowContent(true);
        LoadingStore.handleRedirect();
      }))
      .catch(action((err: object) => {
        LoadingStore.ableToLogin = false;
        LoadingStore.showErrorPage = true;
        LoadingStore.setShowContent(true);
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
  getCurrentPortfolioInvestors() {
    if (this.selectedPortfolioId !== null && this.selectedPortfolioId !== undefined) {
      requester.Investor.getAllInvestors(this.selectedPortfolioId)
        .then(action((result: Object) => {
          this.currentPortfolioInvestors = result.data;
        }));
    }
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

  @action
  // eslint-disable-next-line class-methods-use-this
  getPortfolioTotalAmountUsd(portfolioId: number) {
    return new Promise((resolve: Function, reject: Function) => {
      requester.Portfolio.getPortfolioAssetsByPortfolioId(portfolioId)
        .then(action((result: object) => {
          if (result.data.length && result.data.length > 0) {
            return resolve((result.data
              .reduce((acc: number, obj: Object) => BigNumberService.sum(acc, obj.totalUSD), 0)));
          }
          return resolve(0);
        }))
        .catch(action((err: object) => reject(err)));
    });
  }

  @action
  // eslint-disable-next-line class-methods-use-this
  getPortfolioNumOfShares(portfolioId: number) {
    return new Promise((resolve: Function, reject: Function) => {
      requester.Transaction.getAllTransactions(portfolioId)
        .then(action((result: object) => {
          if (result.data.length && result.data.length > 0) {
            return resolve((result.data[result.data.length - 1].numSharesAfter));
          }
          return resolve(0);
        }))
        .catch(action((err: object) => reject(err)));
    });
  }


  @action
  // eslint-disable-next-line class-methods-use-this
  getPortfolioSharePrice(portfolioCostInUSD: number, numOfSares: number) {
    if (numOfSares !== 0 && portfolioCostInUSD !== 0) {
      return Number(BigNumberService.quotient(portfolioCostInUSD, numOfSares));
    }
    return 0;
  }

  @action
  getPortfoliosData() {
    LoadingStore.setShowLoading(true);
    const result = this.portfolios.map(async (obj: Object) => {
      const numOfShares = await this.getPortfolioNumOfShares(obj.id).then((data: number) => Number(data));
      const totalValueUsd = await this.getPortfolioTotalAmountUsd(obj.id).then((data: number) => Number(data));
      const sharePrice = this.getPortfolioSharePrice(totalValueUsd, numOfShares);
      return [
        obj.portfolioName || obj.userAddress,
        numOfShares,
        sharePrice,
        totalValueUsd,
        obj.portfolioName || '',
        obj.id, // this will be hidden from table rows / cols. Find it with (arr[arr.length - 1])
      ];
    });
    return Promise.all(result).then((data: Array<Object>) => {
      LoadingStore.setShowLoading(false);
      this.allPortfoliosData = data;
      return data;
    })
      .catch(action((err: object) => {
        LoadingStore.setShowLoading(false);
        this.allPortfoliosData = [];
        return new Error(err);
      }));
  }
}

export default new PortfolioStore();
