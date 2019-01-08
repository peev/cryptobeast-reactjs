const { etherScanServices } = require('../integrations/etherScan-services');

const commonMethodsService = (repository) => {
  const bigNumberService = require('./big-number-service');
  const weidexService = require('./weidex-service');
  const weidexFiatMsService = require('./weidex-fiat-ms-service');
  const internalReqService = require('./internal-requeter-service');

  const getTimestampByTxHash = async (txHash) => {
    const etherScanTransaction = await etherScanServices().getTransactionByHash(txHash);
    const etherScanTrBlock = await etherScanServices().getBlockByNumber(etherScanTransaction.blockNumber);
    return Number(etherScanTrBlock.timestamp);
  };

  const tokenToEthToUsd = (amount, tokenPriceEth, ethToUsd) =>
    bigNumberService().product(bigNumberService().product(bigNumberService().gweiToEth(amount), tokenPriceEth), ethToUsd);

  const tokenToEth = (amount, tokenPriceEth) =>
    bigNumberService().product(amount, tokenPriceEth);

  const ethToUsd = (amount, ethToUsdParam) =>
    bigNumberService().product(bigNumberService().gweiToEth(amount), ethToUsdParam);

  const getEthHistory = (start, end) =>
    weidexFiatMsService().getEtherValueByRange(start, end).then(data => data);

  const getTokenPriceEthByTransaction = async (tr) => {
    const timestamp = await getTimestampByTxHash(tr.txHash);
    const tokenName = (tr.type === 'SELL' || tr.type === 'BUY') ? tr.token.name : tr.tokenName;
    const currency = await internalReqService(repository).getCurrencyByTokenName(tokenName);
    return (tokenName === 'ETH') ? 1 :
      weidexService().getTokenValueByTimestampHttp(currency.tokenId, Number(timestamp));
  };

  const getEthToUsd = async timestamp =>
    weidexFiatMsService().getEtherValueByTimestamp(Number(timestamp) * 1000).then(data => data.priceUSD);

  const getEthToUsdNow = async () => {
    const timestamp = new Date().getTime();
    return weidexFiatMsService().getEtherValueByTimestamp(Number(timestamp)).then(data => data.priceUSD);
  };

  const getEthToUsdMiliseconds = async timestamp =>
    weidexFiatMsService().getEtherValueByTimestamp(Number(timestamp)).then(data => data.priceUSD);

  const millisecondsToTimestamp = timestamp => ((timestamp - (timestamp % 1000)) / 1000);

  const calculateDays = (begin, end) => {
    const dates = [];
    for (let i = begin; i <= end; i += (24 * 60 * 60 * 1000)) {
      dates.push(i);
    }
    return dates;
  };

  const getEndOfDay = (timestamp) => {
    const firstDate = new Date(timestamp);
    firstDate.setHours(23);
    firstDate.setMinutes(59);
    firstDate.setSeconds(59);
    return new Date(firstDate.toString()).getTime();
  };

  const getStartOfDay = (timestamp) => {
    const firstDate = new Date(timestamp);
    firstDate.setHours(0);
    firstDate.setMinutes(0);
    firstDate.setSeconds(0);
    return new Date(firstDate.toString()).getTime();
  };

    /**
   * Get balance of last allocation for a day period
   * @param {*} start
   * @param {*} end
   * @param {*} allocations
   */
  const getLastBalanceForDay = async (start, end, allocations) => {
    const lastBalanceForDay = allocations.filter(allocation =>
      new Date(allocation.timestamp.toString()).getTime() >= start &&
      new Date(allocation.timestamp.toString()).getTime() <= end);
    return (lastBalanceForDay.length > 0) ? lastBalanceForDay[lastBalanceForDay.length - 1].balance : undefined;
  };

  const getBalancesByDate = async (timestamps, allocations) => {
    const result = timestamps.map(async (timestamp) => {
      const startTimestamp = getStartOfDay(timestamp);
      const item = await getLastBalanceForDay(startTimestamp, timestamp, allocations);
      return { timestamp, balance: item };
    });
    return Promise.all(result)
      .then(data => data)
      .catch(err => console.log(err));
  };

    /**
   * Fill array balances with previous date balance values if
   * there is no transactions for that day period
   * @param {*} balances
   */
  const fillPreviousBalances = (balances) => {
    const result = [];
    balances.map((item, index) => {
      if (item.balance === undefined) {
        const previousItem = result[index - 1];
        return result.push({ timestamp: item.timestamp, balance: previousItem.balance });
      }
      return result.push(item);
    });
    return result;
  };

  const handlePeriod = (period) => {
    switch (period) {
      case 'd':
        return 1;
      case 'w':
        return 7;
      case 'm':
        return 31;
      default:
        return 0;
    }
  };

  return {
    getTimestampByTxHash,
    tokenToEthToUsd,
    getTokenPriceEthByTransaction,
    getEthToUsd,
    getEthToUsdNow,
    getEthToUsdMiliseconds,
    getEthHistory,
    calculateDays,
    getEndOfDay,
    getStartOfDay,
    getBalancesByDate,
    fillPreviousBalances,
    ethToUsd,
    tokenToEth,
    handlePeriod,
    millisecondsToTimestamp,
  };
};

module.exports = commonMethodsService;
