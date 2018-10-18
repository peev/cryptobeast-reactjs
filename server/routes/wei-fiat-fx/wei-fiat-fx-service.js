const { etherScanServices } = require('../../integrations/etherScan-services');

const weiFiatFxService = (repository) => {
  const marketService = require('../../services/market-service')(repository);

  const getPriceByType = async (type) => {
    let priceUsdValue;

    const ethPrice = await etherScanServices().getETHUSDPrice();
    if(type === 'ETH') {
      priceUsdValue = ethPrice;
    } else {
      await marketService.getTickersFromKraken(`XETHZ${type}`)
        .then((data) => {
          priceUsdValue = data[0].last / ethPrice;
        })
        .catch(err => console.log(err));
    }

    return priceUsdValue;
  };

  const getPricesOfWorldCurrencies = async () => {
    return await marketService.getTickersFromCurrencyLayerApi().catch(err => console.log(err));
  };

  return {
    getPriceByType,
    getPricesOfWorldCurrencies
  };
};


module.exports = { weiFiatFxService };
