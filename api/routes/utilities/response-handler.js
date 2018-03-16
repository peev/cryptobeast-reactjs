const responseHandler = (res, result) => {
  switch (result) {
    case 1:
      res.status(200).send(`${result}`);
      break;
    case 0:
      res.status(404).send(`${result}`);
      break;
    default:
      console.log(`Function error! Response: ${result}`);
      break;
  }
}

module.exports = { responseHandler };
