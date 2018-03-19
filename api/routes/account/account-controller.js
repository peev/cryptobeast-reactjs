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

  return {
    addAccountToPortfolio,
    updateAccount,
    removeAccountFromPortfolio,
  };
};

module.exports = accountController;
