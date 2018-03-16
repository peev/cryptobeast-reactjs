const init = (db) => {
  const getAll = () => {
    return db.Investor.findAll();
  };

  const create = (request) => {
    return db.Investor.create(request);
  };

  return {
    getAll,
    create,
  };
};

module.exports = { init };
