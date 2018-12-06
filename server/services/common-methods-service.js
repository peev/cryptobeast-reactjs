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

  const getTokenPriceEthByTransaction = async (tr) => {
    const timestamp = await getTimestampByTxHash(tr.txHash);
    const tokenName = (tr.type === 'SELL' || tr.type === 'BUY') ? tr.token.name : tr.tokenName;
    const currency = await internalReqService(repository).getCurrencyByTokenName(tokenName);
    return (tokenName === 'ETH') ? 1 :
      weidexService().getTokenValueByTimestampHttp(currency.tokenId, Number(timestamp));
  };

  const getEthToUsd = async timestamp =>
    weidexFiatMsService().getEtherValueByTimestamp(Number(timestamp) * 1000).then(data => data.priceUSD);

  return {
    getTimestampByTxHash,
    tokenToEthToUsd,
    getTokenPriceEthByTransaction,
    getEthToUsd,
  };
};

module.exports = commonMethodsService;
