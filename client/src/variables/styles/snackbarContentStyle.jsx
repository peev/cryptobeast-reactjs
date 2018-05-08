// ##############################
// // // SnackbarContent styles
// #############################

import {
  defaultFont,
  primaryBoxShadow,
  infoBoxShadow,
  successBoxShadow,
  warningBoxShadow,
  dangerBoxShadow,
} from './../styles';

const snackbarContentStyle = {
  root: {
    ...defaultFont,
    position: 'relative',
    padding: '20px 15px',
    lineHeight: '20px',
    marginBottom: '20px',
    fontSize: '14px',
    backgroundColor: 'white',
    color: '#555555',
    borderRadius: '3px',
    boxShadow: '0 12px 20px -10px rgba(255, 255, 255, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(255, 255, 255, 0.2)',
    whiteSpace: 'pre-line',
  },
  info: {
    backgroundColor: '#00d3ee',
    color: '#ffffff',
    ...infoBoxShadow,
  },
  success: {
    backgroundColor: '#ffffff',
    color: '#3ab693',
    ...successBoxShadow,
  },
  warning: {
    backgroundColor: '#ffa21a',
    color: '#ffffff',
    ...warningBoxShadow,
  },
  danger: {
    backgroundColor: '#ffffff',
    color: '#eb4562',
    ...dangerBoxShadow,
  },
  primary: {
    backgroundColor: '#af2cc5',
    color: '#ffffff',
    ...primaryBoxShadow,
  },
  message: {
    padding: '0',
    display: 'block',
    maxWidth: '89%',
  },
  close: {
    width: '14px',
    height: '14px',
  },
  iconButton: {
    width: '24px',
    height: '24px',
  },
  icon: {
    display: 'block',
    left: '15px',
    position: 'absolute',
    top: '50%',
    marginTop: '-15px',
    width: '30px',
    height: '30px',
  },
  iconMessage: {
    color: '#000000',
    paddingLeft: '65px',
    display: 'block',
  },
};

export default snackbarContentStyle;
