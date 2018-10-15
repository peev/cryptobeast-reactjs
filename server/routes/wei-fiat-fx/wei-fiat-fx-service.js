const weiFiatFxService = (res, result) => {
  
  getPriceByType = (type) => {
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
  }

  return {
    createWeiFiatFx,
  };
}

module.exports = { weiFiatFxService };
