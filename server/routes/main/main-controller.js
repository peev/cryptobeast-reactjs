
const mainController = (repository) => {
  const assetController = require('../asset/asset-controller')(repository);
  const fiatFxController = require('../fiat-fx/fiat-fx-controller')(repository);
  const currencyController = require('../currency/currency-controller')(repository);
  const portfolioController = require('../portfolio/portfolio-controller')(repository);
  const transactionController = require('../transaction/transaction-controller')(repository);
  const tradeHistoryController = require('../trade-history/trade-history-controller')(repository);

  const sync = async (req, res) => {
    const addresses = req.body.map(address => address.toLowerCase());
    // POST /weidex/sync ["0x5AE0d1Ffb5e06d32f3dA53aCA952439766Ab029F","0xac5e37db1c85bfc3e6474755ed77cff76d81eb67"]
    await fiatFxController.sync(req, res);
    await console.log('=============== END OF FIATFX =======================================');
    currencyController.sync(req, res);
    await portfolioController.sync(req, res, addresses);
    await assetController.sync(req, res, addresses);
    await transactionController.sync(req, res, addresses);
    await tradeHistoryController.sync(req, res, addresses);
  };

  return {
    sync,
  };
};

module.exports = mainController;
