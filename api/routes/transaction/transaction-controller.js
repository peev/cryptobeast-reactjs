const transactionController = (repository) => {
  const addTransactionToPortfolio = (req, res) => {
    const assetData = req.body;
    repository.transaction.addNewTransaction(assetData)
      .then(() => {
        console.log('\naddNewTransaction response: ', assetData);
        res.status(200).send(assetData);
      })
      .catch((error) => {
        return res.json(error);
      });
  };

  return {
    addTransactionToPortfolio,
  };
};

module.exports = transactionController;
