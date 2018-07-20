// @flow
const drawerWidth = 240;
const headerHeight = 92;

const appStyles = (theme: object) => ({
  root: {
    height: '100vh',
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    position: 'fixed',
    height: headerHeight,
    // zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    '&>div': {
      height: '100%',
    },
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'fixed',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 9,
  },
  toolbar: {
    display: 'flex',
    height: headerHeight,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    overflow: 'auto',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    // padding: theme.spacing.unit * 3,
    padding: '50px',
    marginTop: headerHeight,
  },
  contentOpen: {
    width: '100%',
    marginLeft: '240px',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  contentClose: {
    marginLeft: '72px',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  disabledElement: {
    margin: '0 auto',
    '&>img': {
      fill: '#77787F',
      '&>path': {
        fill: '#77787F',
      },
    },
  },
  centerDisabledSidebarArrows: {
    paddingLeft: '6px',
    margin: '0 auto',
  },
  centerActiveSidebarArrows: {
    marginLeft: '-3px',
  },
  logo: {
    fontSize: '50px',
  },
  logoText: {
    fontSize: '80px',
    marginLeft: '20px',
  },
  combinedLogo: {
    display: 'flex',
    alignItems: 'center',
  },
  combnedLogoContainer: {
    justifyContent: 'start',
    marginLeft: '3px',
  },
  headerPortfolios: {
    paddingLeft: '93px',
  },
});

export default appStyles;
