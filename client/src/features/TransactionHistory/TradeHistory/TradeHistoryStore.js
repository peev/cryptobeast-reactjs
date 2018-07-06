// @flow
import { computed } from 'mobx';
// import requester from '../../../services/requester';
import stores from '../../../stores/';

class TradeHistoryStore {
  // constructor() { }

  @computed
  // eslint-disable-next-line class-methods-use-this
  get mapApiTradeHistory() {
    const trades = stores.PortfolioStore.currentPortfolioApiTradeHistory;

    if (trades) {
      const selectedPortfolioApiTrades = [];
      trades.forEach((trade: object) => {
        const currentRow = [];
        for (let i = 0; i <= 10; i++) {
          switch (i) {
            case 0:
              // 1. Transaction date
              currentRow.push(trade.time);
              break;
            case 1:
              // 2. Entry Date
              currentRow.push(trade.entryDate);
              break;
            case 2:
              // 3. Source
              currentRow.push(trade.source);
              break;
            case 3:
              // 4. Pair
              currentRow.push(trade.pair);
              break;
            case 4:
              // 5. Type
              currentRow.push(trade.type.toUpperCase());
              break;
            case 5:
              // 6. Price
              currentRow.push(Number(`${Math.round(`${trade.price}e2`)}e-2`));
              break;
            case 6:
              // 7. Filled
              currentRow.push(Number(`${Math.round(`${trade.volume}e2`)}e-2`));
              break;
            case 7:
              // 8. Fee
              currentRow.push(trade.fee);
              break;
            case 8:
              // 9. Total
              currentRow.push(currentRow[5] * currentRow[6]);
              break;
            case 9:
            case 10:
              // 10. & 11. Buttons
              currentRow.push('');
              break;
            default:
              console.log('index not found');
              break;
          }
        }

        selectedPortfolioApiTrades.push(currentRow);
      });

      return selectedPortfolioApiTrades;
    }

    return [];
  }

  @computed
  // eslint-disable-next-line class-methods-use-this
  get tradeHistory() {
    const trades = stores.PortfolioStore.currentPortfolioTrades;

    if (trades) {
      const selectedPortfolioTrades = [];
      trades.forEach((trade: object) => {
        const currentRow = [];
        Object.keys(trade).forEach((property: string, ind: number) => {
          // 1. Transaction date
          if (ind === 0) {
            currentRow.push(trade.transactionDate);
          }
          // 2. Entry Date
          if (ind === 1) {
            currentRow.push(trade.entryDate);
          }
          // 3. Source
          if (ind === 2) {
            currentRow.push(trade.source);
          }
          // 4. Pair
          if (ind === 3) {
            currentRow.push(trade.pair);
          }
          // 5. Type
          if (ind === 4) {
            const { type } = trade;
            currentRow.push(type.toUpperCase());
          }
          // 6. Price
          if (ind === 5) {
            const price = Number(`${Math.round(`${trade.price}e2`)}e-2`);
            currentRow.push(price);
          }
          // 7. Filled
          if (ind === 6) {
            currentRow.push(trade.filled);
          }
          // 8. Fee
          if (ind === 7) {
            currentRow.push(`${trade.fee} ${trade.feeCurrency} `);
          }
          // 9. Total
          if (ind === 8) {
            const totalPrice = Number(`${Math.round(`${trade.totalPrice}e2`)}e-2`);
            currentRow.push(`${totalPrice} ${trade.market} `);
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
      const result = selectedPortfolioTrades.concat(this.mapApiTradeHistory);

      return result;
    }

    return 0;
  }
}

export default new TradeHistoryStore();
