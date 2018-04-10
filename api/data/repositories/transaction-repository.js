const init = (db) => {
  const addNewTransaction = (request) => {
    const portfolio = db.Portfolio.findById(request.portfolioId);
    const createdTransaction = db.Transaction.create(request.transaction)
      .then(result => result);

    return new Promise((resolve, reject) => {
      Promise.all([
        portfolio,
        createdTransaction,
      ]).then((values) => {
        resolve(values[0].addTransaction(values[1]));
      }).catch((err) => {
        reject(err);
      });
    });
  };

  return {
    addNewTransaction,
  };
};

module.exports = { init };
