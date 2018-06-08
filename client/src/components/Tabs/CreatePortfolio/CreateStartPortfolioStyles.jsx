import { drawerWidth, transition, container } from '../../../variables/styles';

const createStartPortfolioStyles = theme => ({
  wrapper: {
    position: 'relative !important',
    top: '0',
    height: '100vh',
    // backgroundColor: '#EEE',
  },
  mainPanel: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    overflow: 'auto',
    position: 'relative',
    float: 'right',
    ...transition,
    maxHeight: '100%',
    width: '100%',
    overflowScrolling: 'touch',
  },
  content: {
    marginTop: '70px',
    padding: '30px 15px',
    minHeight: 'calc(100% - 123px)',
  },
  container,
  map: {
    marginTop: '70px',
  },
});

export default createStartPortfolioStyles;
