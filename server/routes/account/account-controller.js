const { bittrexServices } = require('../../integrations/bittrex-services');
const { krakenServices } = require('../../integrations/kraken-services');

const modelName = 'Account';

const accountController = (repository) => {
  const createAccount = (req, res) => {
    const account = req.body;
    repository.create({ modelName, newObject: account })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const updateAccount = (req, res) => {
    const account = req.body;
    repository.update({ modelName, updatedRecord: account })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const removeAccount = (req, res) => {
    const { accountId } = req.body;
    repository.remove({ modelName, id: accountId })
      .then(result => responseHandler(res, result))
      .catch((error) => {
        res.json(error);
      });
  };

  // #region Balances
  const getAccountBalance = (req, res) => {
    // req is account object with apiKey, apiSecret and foreign key portfolioId
    // TODO: switch between apis
    const account = req.body;
    let services = '';
    switch (account.apiServiceName) {
      case 'Bittrex':
        services = bittrexServices;
        break;
      case 'Kraken':
        services = krakenServices;
        break;
      default:
        console.log('There is no such api');
        break;
    }

    services().getBalance(account)
      .then((assets) => {
        repository.createMany({ modelName: 'Asset', newObjects: assets });
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };
  // #endregion

  // #region Trades
  const createTrade = (req, res) => {
    const trade = req.body;
    repository.create({ modelName:'Trade', newObject: trade })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };
  
  const updateTrade = (req, res) => {
    const trade = req.body;
    repository.update({ modelName:'Trade', updatedRecord: trade })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const removeTrade = (req, res) => {
    const tradeId = req.params.id;
    repository.remove({ modelName: 'Trade', id: tradeId })
      .then(result => responseHandler(res, result))
      .catch((error) => {
        res.json(error);
      });
  };

  const getAllTrades = (req, res) => {
    repository.find({ modelName: 'Trade' })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };
  // #endregion

  return {
    createAccount,
    updateAccount,
    removeAccount,
    getAccountBalance,
    createTrade,
    updateTrade,
    removeTrade,
    getAllTrades,
  };
};

module.exports = accountController;
