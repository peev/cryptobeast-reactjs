const init = (db) => {
  const addInvestor = (request) => {
    const newInvestor = {
      fullName: request.fullName,
      email: request.email,
      telephone: request.telephone,
      dateOfEntry: request.dateOfEntry,
      isFounder: request.isFounder,
      managementFee: request.managementFee,
      purchasedShares: request.purchasedShares,
    };
    const portfolio = db.Portfolio.findById(request.portfolioId);
    const createdInvestor = db.Investor.create(newInvestor)
      .then(result => result);

    const ret = new Promise((resolve, reject) => {
      Promise.all([
        portfolio,
        createdInvestor,
      ]).then((values) => {
        resolve(values[0].addInvestor(values[1]));
      }).catch((err) => {
        reject(err);
      });
    });

    return ret;
  };

  const update = (id, data) => {
    return db.Investor.update(data, {
      where: { id: id },
    });
  };

  const deposit = (id, data) => {
    const amountToAdd = data.amount;
    const foundInvestor = db.Investor.findById(id);

    return foundInvestor.then((investor) => {
      investor.increment('purchasedShares', { by: amountToAdd });
    });
  };

  const withdrawal = (id, data) => {
    const amountToWithdrawal = data.amount;

    console.log(id, amountToWithdrawal);
    const foundInvestor = db.Investor.findById(id);

    return foundInvestor.then((investor) => {
      investor.decrement('purchasedShares', { by: amountToWithdrawal });
    });
  };

  const removeInvestor = (request) => {
    const portfolio = db.Portfolio.findById(request.portfolioId);
    const investor = db.Investor.findById(request.investorId);
    const deleteInvestor = db.Investor.destroy({
      where: { id: request.investorId },
    });

    const ret = new Promise((resolve, reject) => {
      Promise.all([
        portfolio,
        investor,
      ]).then((values) => {
        resolve(values[0].removeAccount(values[1]));
      })
        .then(deleteInvestor)
        .catch((err) => {
          reject(err);
        });
    });

    return ret;
  };

  return {
    addInvestor,
    update,
    deposit,
    withdrawal,
    removeInvestor,
  };
};

module.exports = { init };
