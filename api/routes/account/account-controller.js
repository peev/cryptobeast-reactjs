const { bittrexServices } = require('../../integrations/bittrex-services');
const { krakenServices } = require('../../integrations/kraken-services');

const accountController = (repository) => {
  const addAccountToPortfolio = (req, res) => {
    const accountData = req.body;
    repository.account.addAccount(accountData)
      .then((response) => {
        console.log('\naddAccount response: ', response);
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const updateAccount = (req, res) => {
    // const id = req.params.id;
    const accountData = req.body;

    repository.account.update(accountData)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  const removeAccountFromPortfolio = (req, res) => {
    const requestData = req.body;
    repository.account.removeAccount(requestData)
      .then(result => responseHandler(res, result))
      .catch((error) => {
        return res.json(error);
      });
  };

  // Balances ===============================================
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
        return repository.asset.addAssetsFromApi(assets, account);
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  return {
    addAccountToPortfolio,
    updateAccount,
    removeAccountFromPortfolio,
    getAccountBalance,
  };
};

module.exports = accountController;
