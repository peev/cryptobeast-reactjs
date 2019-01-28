const selectFromPortfoliosStyles = () => ({
  containerMain: {
    padding: '0px 70px',
  },
  title: {
    margin: '10px 0',
  },
  grid: {
    margin: '20px',
  },
  gridLastElement: {
    '&:after': {
      content: '""',
      width: '100%',
      height: '100%',
    },
  },
  paper: {
    padding: '20px 30px',
  },
  content: {
    marginTop: '70px',
    padding: '30px 15px',
    minHeight: 'calc(100% - 123px)',
  },
  containerTitle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '50px',
  },
  containerContent: {
    display: 'flex',
    justifyContent: 'center',
  },
  portfolioName: {
    textTransform: 'capitalize',
    fontWeight: '600',
    lineHeight: 1,
    display: 'inline-block',
    width: '70%',
    whiteSpace: 'nowrap',
    overflow: 'hidden !important',
    textOverflow: 'ellipsis',
  },
  portfolioPercent: {
    width: '30%',
    textAlign: 'right',
    padding: '0',
    display: 'inline-block',
  },
  positivePercent: {
    color: '#50B692',
  },
  negativePercent: {
    color: '#B94A48',
  },
  portfolioValue: {
    paddingLeft: '5px',
  },
  generalPStyle: {
    display: 'inline-block',
    margin: 0,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    padding: '6px 22px',
    textTransform: 'uppercase',
    fontSize: '10px',
    border: 'none',
    background: '#5F6779',
    color: 'white',
    '&:hover': {
      cursor: 'pointer',
    },
    '&:before': {
      content: '""',
    },
  },
  marginTop: {
    marginTop: '10px',
  },
});

export default selectFromPortfoliosStyles;
