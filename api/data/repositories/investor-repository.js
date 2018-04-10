const init = (db) => {
  const moveShares = (data, transactionType) => {
    return new Promise((resolve, reject) => {
      db.Investor.findById(data.investorId)
        .then((investor) => {
          let shares;
          switch (transactionType) {
            case 'newInvestor':
              shares = investor.purchasedShares;
              break;
            case 'deposit':
            case 'withdrawal':
              shares = investor.purchasedShares + data.transaction.shares;
              break;
            default:
              break;
          }
          investor.update({
            purchasedShares: shares,
          })
            // Add the transaction to investor and portfolio to assign foreign keys
            .then((updatedInvestor) => {
              db.Transaction.create(data.transaction)
                .then((transaction) => {
                  updatedInvestor.addTransaction(transaction);
                  db.Portfolio.findById(updatedInvestor.portfolioId)
                    .then((portfolio) => {
                      const newShares = portfolio.shares + data.transaction.shares;
                      portfolio.update({
                        shares: newShares,
                      })
                        .then(() => {
                          portfolio.addTransaction(transaction)
                            .then(() => resolve(transaction));
                        });
                    });
                });
            });
        });
    });
  };

  const addInvestor = (request) => {
    const createdInvestor = db.Investor.create(request.investor)
      .then(result => result);
    const portfolio = db.Portfolio.findById(request.portfolioId);

    return new Promise((resolve, reject) => {
      Promise.all([
        portfolio,
        createdInvestor,
      ]).then((values) => {
        resolve(values[0].addInvestor(values[1])
          .then(() => moveShares({
            investorId: (values[1]).id,
            transaction: request.transaction,
          }, 'newInvestor')));
      }).catch((err) => {
        reject(err);
      });
    });
  };

  const update = (id, data) => {
    return db.Investor.update(data, {
      where: { id },
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
    moveShares,
    withdrawal,
    removeInvestor,
  };
};

module.exports = { init };
