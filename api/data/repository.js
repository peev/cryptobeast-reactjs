const init = (db) => {
  const create = request =>
    db[request.modelName].create(request.newObject);

  const createMany = request =>
    db[request.modelName].bulkCreate(request.newObjects);

  const findById = request =>
    db[request.modelName].findById(request.id);

  const find = request =>
    db[request.modelName].findAll(request.options);

  const update = request =>
    db[request.modelName].update(
      request.updatedRecord,
      { where: { id: request.updatedRecord.id } },
    );

  const remove = request =>
    db[request.modelName].destroy({
      where: { id: request.id },
    });

  const removeAll = request =>
    db[request.modelName].destroy({
      where: {},
    });

  return {
    create,
    createMany,
    findById,
    find,
    update,
    remove,
    removeAll,
  };
};

module.exports = { init };
