const userController = (repository) => {
  const modelName = 'User';

  const updateClosingTime = (req, res) => {
    return new Promise((resolve, reject) => {
      repository.findOne({
        modelName: 'Setting',
        options: {
          where: {
            userId: req.body.userId,
            name: req.body.name,
          }
        },
      })
        .then((setting) => {
          if (setting === null) {
            // create new setting
            repository.create({
              modelName: 'Setting',
              newObject: {
                userId: req.body.userId,
                name: req.body.name,
                value: req.body.value,
              }
            })
          } else {
            // update selected setting
            repository.update({
              modelName: 'Setting',
              updatedRecord: {
                id: setting.id,
                userId: req.body.userId,
                name: req.body.name,
                value: req.body.value,
              }
            })
          }
        })
        .catch((error) => {
          return res.json(error);
        });
    })
      .catch((error) => {
        return res.json(error);
      });
  };

  return {
    updateClosingTime,
  };
};

module.exports = userController;
