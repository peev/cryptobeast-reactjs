// @flow
import React, { Component } from 'react';
import { withStyles, Toolbar } from 'material-ui';
import { inject, observer } from 'mobx-react';

import AuthService from './../../services/Authentication';
import PortfolioSelect from '../Selectors/PortfolioSelect/PortfolioSelect';
import buttonStyle from '../../variables/styles/buttonStyle';
import headerStyle from '../../variables/styles/headerStyle';


const styles = () => ({
  headerContainer: {
    position: 'fixed',
    width: '100%',
    paddingLeft: '0px',
    backgroundColor: '#22252f',
    zIndex: '1',
  },
  logoutButton: {
    marginLeft: '40px',
    padding: '10px 40px',
    color: 'white',
    backgroundColor: '#4D5265',
    border: 'none',
    fontSize: '14px',
    textTransform: 'uppercase',
    '&:hover': {
      cursor: 'pointer',
      color: 'black',
      backgroundColor: '#8A8E9B',
    },
  },
});

type Props = {
  classes: Object,
  PortfolioStore: Object,
  // color: 'primary' | 'info' | 'success' | 'warning' | 'danger',
};

@inject('PortfolioStore')
@observer
class Header extends Component<Props> {
  render() {
    const { classes, PortfolioStore } = this.props;
    const portfoliosArray = PortfolioStore.portfolios;

    const handleLogout = () => {
      AuthService.signOut();
    };

    return (
      <Toolbar className={classes.headerContainer}>
        {portfoliosArray.length > 0 && <PortfolioSelect />}
        <button
          className={classes.logoutButton}
          onClick={() => handleLogout()}
        >
          Logout
        </button>
      </Toolbar>
    );
  }
}

export default withStyles(styles, headerStyle, buttonStyle)(Header);
