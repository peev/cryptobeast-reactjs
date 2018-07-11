const updateTradeStyles = theme => ({
  container: {
    width: '100%',
    margin: '40px 40px 0',
    padding: '20px 25px',
  },
  containerTitle: {
    margin: '0',
    fontSize: '16px',
    textTransform: 'uppercase',
  },
  containerItems: {
    marginTop: '1px',
  },
  btnAdd: {
    float: 'right',
    margin: '0',
  },
  alignInput: {
    width: '95%',
    marginTop: '25px',
  },
  alignInputAfter: {
    width: '95%',
    marginTop: '5px',
  },
  alignInputAfter2: {
    width: '95%',
    marginTop: '12px',
  },
  alignInputWidth: {
    width: '95%',
  },
  paper: {
    position: 'absolute',
    minWidth: '500px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '400',
    textAlign: 'center',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
});

export default updateTradeStyles;
