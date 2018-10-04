const modelName = 'WeiUser';

const weiUserController = (repository) => {
  const createWeiUser = (req, res) => {
    const weiUser = req.body;

    repository.create({ modelName, newObject: weiUser })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  const updateWeiUser = async (req, res) => {
    const { id } = req.params;
    const weiUserData = Object.assign({}, req.body, { id });
    repository.update({ modelName, updatedRecord: weiUserData })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => res.json(error));
  };

  const getWeiUser = (req, res) => {
    const { id } = req.params;
    repository.findById({ modelName, id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  return {
    createWeiUser,
    updateWeiUser,
    getWeiUser,
  };
};

module.exports = weiUserController;
