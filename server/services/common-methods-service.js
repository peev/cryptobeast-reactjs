const commonMethodsService = () => {
  const bigNumberService = require('./big-number-service');
  const weidexFiatMsService = require('./weidex-fiat-ms-service');

  const tokenToEthToUsd = (amount, tokenPriceEth, ethToUsd) =>
    bigNumberService().product(bigNumberService().product(bigNumberService().gweiToEth(amount), tokenPriceEth), ethToUsd);

  const tokenToEth = (amount, tokenPriceEth) =>
    bigNumberService().product(amount, tokenPriceEth);

  const ethToUsd = (amount, ethToUsdParam) =>
    bigNumberService().product(bigNumberService().gweiToEth(amount), ethToUsdParam);

  const getEthHistoryDayValue = (start, end) =>
    weidexFiatMsService().getEtherPriceByRangeDayValue(start, end).then(data => data);

  const defineEthHistory = (timestamps, ethHistory) => {
    const result = [];
    timestamps.forEach((timestamp, index) => {
      result.push({ timestamp, priceUsd: ethHistory[index].priceUSD });
    });
    return result;
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

  const getEtherPriceByClosestTimestamp = (num, arr) => {
    let curr = arr[0];
    for (let i = 0; i < arr.length; i += 1) {
      if (Math.abs(num - arr[i].createdAt) < Math.abs(num - curr.createdAt)) {
        curr = arr[i];
      }
    }
    return curr;
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

  const sortNumberAsc = (a, b) => (a - b);

  const sortNumberDesc = (a, b) => (b - a);

  const sortTokensByDateAsc = data =>
    Object.keys(data).sort().reduce((result, key) => {
      // eslint-disable-next-line no-param-reassign
      result[key] = data[key];
      return result;
    }, {});

  return {
    tokenToEthToUsd,
    getEthToUsd,
    getEthToUsdNow,
    getEthToUsdMiliseconds,
    calculateDays,
    getEndOfDay,
    getStartOfDay,
    getBalancesByDate,
    fillPreviousBalances,
    ethToUsd,
    tokenToEth,
    handlePeriod,
    millisecondsToTimestamp,
    getEtherPriceByClosestTimestamp,
    getEthHistoryDayValue,
    sortNumberAsc,
    sortNumberDesc,
    defineEthHistory,
    sortTokensByDateAsc,
  };
};

module.exports = commonMethodsService;
