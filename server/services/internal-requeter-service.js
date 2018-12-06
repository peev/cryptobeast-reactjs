const internalRequesterService = (repository) => {
  const getCurrencyByTokenName = async tokenName => repository.findOne({
    modelName: 'Currency',
    options: {
      where: {
        tokenName,
      },
    },
  })
    .catch(err => console.log(err));

  return {
    getCurrencyByTokenName,
  };
};

module.exports = internalRequesterService;
