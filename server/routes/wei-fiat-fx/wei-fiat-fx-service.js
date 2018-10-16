const { etherScanServices } = require('../../integrations/etherScan-services');

const weiFiatFxService = (repository) => {
  const marketService = require('../../services/market-service')(repository);

  const getPriceByType = async (type) => {
    let priceUsdValue;

    const ethPrice = await etherScanServices().getETHUSDPrice();

    switch (type) {
      case 'ETH':
        priceUsdValue = await etherScanServices().getETHUSDPrice();
        break;
      default:
        await marketService.getTickersFromKraken(`XETHZ${type}`)
          .then((data) => {
            priceUsdValue = data[0].last / ethPrice;
          })
          .catch(err => console.log(err));
        break;
    }

    return priceUsdValue;
  };

  return {
    getPriceByType,
  };
};


module.exports = { weiFiatFxService };
