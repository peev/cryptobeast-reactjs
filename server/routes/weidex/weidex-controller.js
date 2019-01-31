
const weidexController = (repository) => {
  const WeidexService = require('../../services/weidex-service')(repository);
  const assetController = require('../asset/asset-controller')(repository);
  const currencyController = require('../currency/currency-controller')(repository);
  const portfolioController = require('../portfolio/portfolio-controller')(repository);
  const transactionController = require('../transaction/transaction-controller')(repository);
  const tradeHistoryController = require('../trade-history/trade-history-controller')(repository);
  const allocationsController = require('../allocations/allocations-controller')(repository);

  const validateAddresses = async (req, res) => {
    const addresses = req.body.map(address => address.toLowerCase());
    const addressesArray = addresses.map(async (address) => {
      try {
        const user = await WeidexService.getUserHttp(address);
        return user.address;
      } catch (error) {
        return undefined;
      }
    });
    return Promise.all(addressesArray).then((filteredAddresses) => {
      const arr = filteredAddresses.filter(address => address !== undefined);
      return res.status(200).send(arr);
    });
  };

  const sync = async (req, res) => {
    // POST /weidex/sync ["0x5AE0d1Ffb5e06d32f3dA53aCA952439766Ab029F","0xac5e37db1c85bfc3e6474755ed77cff76d81eb67"]
    const addresses = req.body.map(address => address.toLowerCase());
    console.log('================== START CURRENCY ==================');
    await currencyController.sync(req, res)
      .then(() => console.log('================== START PORTFOLIO =================='));
    await portfolioController.sync(req, res, addresses)
      .then(() => console.log('================== START ASSETS =================='));
    await assetController.sync(req, res, addresses)
      .then(() => console.log('================== START TRANSACTIONS =================='));
    await transactionController.sync(req, res, addresses)
      .then(() => console.log('================== START TRADES =================='));
    await tradeHistoryController.sync(req, res, addresses)
      .then(() => console.log('================== START ALLOCATIONS =================='));
    await allocationsController.sync(req, res, addresses)
      .then(() => console.log('================== START UPDATE TRANSACTIONS =================='));
    await transactionController.updateTransactions(req, res, addresses);
  };

  return {
    sync,
    validateAddresses,
  };
};

module.exports = weidexController;
