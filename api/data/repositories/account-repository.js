const init = (db) => {
  const addAccount = (request) => {
    const newAccount = {
      apiServiceName: request.apiServiceName,
      apiKey: request.apiKey,
      apiSecret: request.apiSecret,
    };
    const portfolio = db.Portfolio.findById(request.id);
    const createdAccount = db.Account.create(newAccount)
      .then(result => result);

    const ret = new Promise((resolve, reject) => {
      Promise.all([
        portfolio,
        createdAccount,
      ]).then((values) => {
        resolve(values[0].addAccount(values[1]));
      }).catch((err) => {
        reject(err);
      });
    });

    return ret;
  };

  const update = (request) => {
    return db.Account.update({
      apiServiceName: request.apiServiceName,
      apiKey: request.apiKey,
      apiSecret: request.apiSecret,
    }, {
        where: { id: request.id },
      });
  };

  const removeAccount = (request) => {
    const portfolio = db.Portfolio.findById(request.portfolioId);
    const account = db.Account.findById(request.accountId);
    const deleteAccount = db.Account.destroy({
      where: { id: request.accountId },
    });

    const ret = new Promise((resolve, reject) => {
      Promise.all([
        portfolio,
        account,
      ]).then((values) => {
        resolve(values[0].removeAccount(values[1]));
      })
        .then(deleteAccount)
        .catch((err) => {
          reject(err);
        });
    });

    return ret;
  };

  return {
    addAccount,
    update,
    removeAccount,
  };
};

module.exports = { init };
