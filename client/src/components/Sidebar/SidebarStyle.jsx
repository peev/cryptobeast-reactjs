// ##############################
// // // Sidebar styles
// #############################

import {
  drawerWidth,
  transition,
  boxShadow,
  defaultFont,
  primaryColor,
  primaryBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  navBackgroundColor,
} from '../../variables/styles';

const sidebarStyle = theme => ({
  drawerPaper: {
    border: 'none',
    // position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    zIndex: '2',
    backgroundColor: navBackgroundColor,
    // overflow: 'auto',
    ...boxShadow,
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'fixed',
      height: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      width: drawerWidth,
      ...boxShadow,
      position: 'fixed',
      display: 'block',
      top: '0',
      height: '100vh',
      left: '0',
      zIndex: '1032',
      visibility: 'visible',
      overflowY: 'visible',
      borderTop: 'none',
      textAlign: 'left',
      paddingRight: '0px',
      paddingLeft: '0',
      transform: `translate3d(${drawerWidth}px, 0, 0)`,
      ...transition,
    },
  },
  disableOverlay: {
    '&:after': {
      content: '""',
      color: 'green',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '10',
      background: 'rgba(0,0,0,0.3)',
    },
  },
  logo: {
    position: 'relative',
    padding: '15px 15px',
    zIndex: '4',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      height: '1px',
      right: '15px',
      width: 'calc(100% - 30px)',
    },
  },
  logoLink: {
    ...defaultFont,
    textTransform: 'uppercase',
    padding: '5px 0',
    display: 'block',
    fontSize: '18px',
    textAlign: 'left',
    fontWeight: '400',
    lineHeight: '30px',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    '&,&:hover': {
      color: '#FFFFFF',
    },
  },
  logoImage: {
    width: '30px',
    display: 'inline-block',
    maxHeight: '30px',
    marginLeft: '10px',
    marginRight: '15px',
  },
  img: {
    width: '35px',
    top: '22px',
    position: 'absolute',
    verticalAlign: 'middle',
    border: '0',
  },
  background: {
    zIndex: '1',
    height: '100%',
    width: '100%',
    display: 'block',
    top: '0',
    left: '0',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    '&:after': {
      position: 'absolute',
      zIndex: '3',
      width: '100%',
      height: '100%',
      content: '""',
      display: 'block',
      background: '#000',
      opacity: '.8',
    },
  },
  list: {
    paddingLeft: '0',
    paddingTop: '0',
    paddingBottom: '0',
    marginBottom: '0',
    listStyle: 'none',
  },
  item: {
    padding: '0',
    position: 'relative',
    display: 'block',
    textDecoration: 'none',
    '&.active': {
      padding: '0',
      '&:after': {
        width: '3px',
        height: '50%',
        content: '""',
        background: '#366d72',
        position: 'absolute',
        top: '24%',
        left: '0',
      },
    },
  },
  itemWrapper: {
    padding: '16px 13px',
  },
  indicator: {
    position: 'absolute',
    width: '3px',
    height: '50%',
    background: '#366d72',
    verticalAlign: 'middle',
    left: '0',
    top: '24%',
    display: 'table-cell',
  },
  itemClosed: {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  itemLink: {
    transition: 'all 300ms linear',
    borderRadius: '3px',
    position: 'relative',
    display: 'block',
    padding: '0',
    backgroundColor: 'transparent',
    ...defaultFont,
  },
  itemIcon: {
    width: '24px',
    height: '30px',
    float: 'left',
    // margin: '0 25px',
    margin: '0 25px 0 10px',
    textAlign: 'center',
    verticalAlign: 'middle',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  itemText: {
    ...defaultFont,
    margin: '0',
    padding: '0',
    lineHeight: '30px',
    fontSize: '14px',
    color: '#FFFFFF',
  },
  whiteFont: {
    color: '#FFFFFF',
  },
  purple: {
    backgroundColor: primaryColor,
    ...primaryBoxShadow,
    '&:hover': {
      backgroundColor: primaryColor,
      ...primaryBoxShadow,
    },
  },
  blue: {
    backgroundColor: infoColor,
    boxShadow:
      '0 12px 20px -10px rgba(0,188,212,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(0,188,212,.2)',
    '&:hover': {
      backgroundColor: infoColor,
      boxShadow:
        '0 12px 20px -10px rgba(0,188,212,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(0,188,212,.2)',
    },
  },
  green: {
    backgroundColor: successColor,
    boxShadow:
      '0 12px 20px -10px rgba(76,175,80,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(76,175,80,.2)',
    '&:hover': {
      backgroundColor: successColor,
      boxShadow:
        '0 12px 20px -10px rgba(76,175,80,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(76,175,80,.2)',
    },
  },
  orange: {
    backgroundColor: warningColor,
    boxShadow:
      '0 12px 20px -10px rgba(255,152,0,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(255,152,0,.2)',
    '&:hover': {
      backgroundColor: warningColor,
      boxShadow:
        '0 12px 20px -10px rgba(255,152,0,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(255,152,0,.2)',
    },
  },
  red: {
    backgroundColor: dangerColor,
    boxShadow:
      '0 12px 20px -10px rgba(244,67,54,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(244,67,54,.2)',
    '&:hover': {
      backgroundColor: dangerColor,
      boxShadow:
        '0 12px 20px -10px rgba(244,67,54,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(244,67,54,.2)',
    },
  },
  sidebarWrapper: {
    position: 'relative',
    height: 'calc(100vh - 75px)',
    overflow: 'auto',
    overflowX: 'hidden',
    width: '260px',
    zIndex: '4',
    overflowScrolling: 'touch',
    backgroundColor: navBackgroundColor,
  },
});

export default sidebarStyle;
