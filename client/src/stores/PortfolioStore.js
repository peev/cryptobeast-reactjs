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
import NotificationStore from './NotificationStore';
import AssetStore from './AssetStore';

class PortfolioStore {
  @observable fethingPortfolios;
  @observable portfolios;
  @observable selectedPortfolio;
  @observable selectedPortfolioId;
  @observable currentPortfolioAssets;
  @observable currentPortfolioInvestors;
  @observable currentPortfolioTransactions;
  @observable currentPortfolioTrades;
  @observable newPortfolioName;

  constructor() {
    this.portfolios = [];
    this.fethingPortfolios = false;
    this.selectedPortfolio = null;
    this.selectedPortfolioId = 0;
    this.currentPortfolioAssets = [];
    this.currentPortfolioInvestors = [];
    this.currentPortfolioTransactions = [];
    this.newPortfolioName = '';
    this.currentPortfolioTrades = [];


    // eslint-disable-next-line no-unused-expressions
    // gets portfolios at app init
    // this.getPortfolios().then(() => {
    //   MarketStore.init();
    // });
  }

  @action
  setFetchingPortfolios(value) {
    this.fethingPortfolios = value;
  }
  // ======= Computed =======
  // #region Computed
  // #region Summary Page
  @computed
  get summaryTotalInvestmentInUSD() {
    if (this.selectedPortfolio && this.selectedPortfolio.transactions.length > 0) {
      let totalAmount = 0;
      this.selectedPortfolio.transactions.forEach((el) => {
        totalAmount += el.amountInUSD;
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
  get tradeHistory() {
    const trades = this.currentPortfolioTrades;
    const selectedPortfolioTrades = [];
    trades.forEach((el) => {
      const currentRow = [];
      Object.keys(el).forEach((prop, ind) => {
        // 1. Transaction date
        if (ind === 0) {
          currentRow.push(el.transactionDate);
        }
        // 2. Entry Date
        if (ind === 1) {
          currentRow.push(el.entryDate);
        }
        // 3. Source
        if (ind === 2) {
          currentRow.push(el.source);
        }
        // 4. Pair
        if (ind === 3) {
          currentRow.push(el.pair);
        }
        // 5. Type
        if (ind === 4) {
          const { type } = el;
          currentRow.push(type.toUpperCase());
        }
        // 6. Price
        if (ind === 5) {
          const price = Number(`${Math.round(`${el.price}e2`)}e-2`);
          currentRow.push(price);
        }
        // 7. Filled
        if (ind === 6) {
          currentRow.push(el.filled);
        }
        // 8. Fee
        if (ind === 7) {
          currentRow.push(`${el.fee} ${el.feeCurrency}`);
        }
        // 9. Total
        if (ind === 8) {
          const totalPrice = Number(`${Math.round(`${el.totalPrice}e2`)}e-2`);
          currentRow.push(`${totalPrice} ${el.market}`);
        }
        if (ind === 9) {
          currentRow.push('');
        }
        if (ind === 10) {
          currentRow.push('');
        }
      });
      selectedPortfolioTrades.push(currentRow);
    });
    return selectedPortfolioTrades;
  }

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

    const trade = {
      transactionDate: newAssetAllocation.selectedDate,
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
        if (!grouped[asset.currency]) {
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
    if (this.selectedPortfolio &&
      this.currentPortfolioAssets.length > 0 &&
      MarketStore.baseCurrencies.length > 0 &&
      MarketStore.marketSummaries.hasOwnProperty('BTC-ETH')) {
      const { marketPriceHistory } = MarketStore;
      const currentAssets = this.groupedCurrentPortfolioAssets;
      const valueOfUSD = MarketStore.baseCurrencies[3].last; // NOTE: this if USD
      const selectedPortfolioSummary = [];

      // Creates the needed array, that will be shown in the view
      currentAssets.forEach((el) => {
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
            default:
              assetBTCEquiv = MarketStore.marketSummaries[`BTC-${currentRow[0]}`] ?
                MarketStore.marketSummaries[`BTC-${currentRow[0]}`].Last :
                0;
              break;
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
              case 'EUR':
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
    };
    requester.Portfolio.create(newPortfolio)
      .then(action((result) => {
        this.selectedPortfolioId = result.data.id;
        InvestorStore.createDefaultInvestor(result.data.id);
        this.portfolios.push(result.data);
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
        NotificationStore.addMessage('errorMessages', 'Portfolio Name  already Exists');
        hasErrors = true;
      }
    }

    return hasErrors;
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
    if (this.portfolios.length) {
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
  }

  @action
  getPortfolios() {
    this.fethingPortfolios = true;
    return new Promise((resolve, reject) => {
      requester.Portfolio.getAll()
        .then(action((result) => {
          this.portfolios = result.data;
          this.fethingPortfolios = false;
          if (this.selectedPortfolioId > 0) {
            this.selectPortfolio(this.selectedPortfolioId);
          }
          resolve(true);
        }))
        .catch(action((err) => {
          this.fethingPortfolios = false;
          console.log(err);
          reject(err);
        }));
    });
  }


  @action.bound
  resetPortfolio() {
    this.newPortfolioName = '';
  }
}

export default new PortfolioStore();
