// @flow
const portfolioSelectStyles = (theme: object) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    minWidth: 150,
    // float: 'left',
    paddingLeft: '48px',
  },
  listItem: {
    height: '100%',
    padding: '15px 15px 15px 30px',
    backgroundColor: '#22252f',
    '&:hover': {
      backgroundColor: '#143141 !important',
    },
  },
  selectedListItem: {
    backgroundColor: '#143141 !important',
  },
  listItemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  listItemName: {
    color: '#F6F6F6',
    margin: '0 0 10px 0',
  },
  listItemDescription: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: '-15px',
    '& div': {
      margin: '0',
    },
    '& :first-child': {
      color: '#39b493',
      fontWeight: '700',
    },
    '& :last-child': {
      color: '#D0D0D0',
      fontSize: '14px',
    },
  },
  menuItemContainer: {
    marginTop: '64px',
    '&>ul': {
      padding: '0',
    },
  },
  root: {
    '&>svg': {
      paddingRight: '10px',
      fill: '#F6F6F6',
      top: '14px',
    },
  },
  select: {
    display: 'flex',
    alignItems: 'center',
    height: '60px',
    // width: '150px',
    padding: '10px 30px',
    color: '#F6F6F6',
    '&>div': {
      width: '100%',
      padding: '0',
      borderBottom: 'none',
    },
  },
  upArrow: {
    position: 'relative',
    top: '1px',
    transform: 'rotate(180deg)',
    padding: '0 7px',
    '& polyline': {
      stroke: '#39b493',
    },
  },
  dropDownArrow: {
    position: 'absolute',
    right: '-5px',
    pointerEvents: 'none',
    fontSize: '17px',
    top: '19px !important',
  },
});

export default portfolioSelectStyles;
