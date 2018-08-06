const init = (db) => {
  const create = request =>
    db[request.modelName].create(request.newObject);

  const createMany = request =>
    db[request.modelName].bulkCreate(request.newObjects);

  const findById = request =>
    db[request.modelName].findById(request.id);

  const find = request =>
    db[request.modelName].findAll(request.options);

  const findOne = request =>
    db[request.modelName].findOne(request.options);

  const update = request =>
    db[request.modelName].update(
      request.updatedRecord,
      { where: { id: request.updatedRecord.id } },
    );

  const updateMany = request =>
    db[request.modelName].update(
      request.updatedRecord,
      request.options,
    );

  const remove = request =>
    db[request.modelName].destroy({
      where: { id: request.id },
    });

  const removeAll = request =>
    db[request.modelName].destroy({
      where: request.options || {},
    });

  const rawQuery = request =>
    db.sequelize.query(request.query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

  return {
    create,
    createMany,
    findById,
    find,
    findOne,
    update,
    updateMany,
    remove,
    removeAll,
    rawQuery,
  };
};

module.exports = { init };
