// @flow
import React, { Component } from 'react';
import { withStyles, Toolbar, Button } from 'material-ui';
import { inject, observer } from 'mobx-react';

import AuthService from './../../services/Authentication';
import PortfolioSelect from '../Selectors/PortfolioSelect/PortfolioSelect';
import buttonStyle from '../../variables/styles/buttonStyle';
import headerStyle from '../../variables/styles/headerStyle';


const styles = () => ({
  root: {
    flexGrow: 1,
  },
  headerContainer: {
    flexGrow: 1,
    // position: 'fixed',
    width: '100%',
    paddingLeft: '0px',
    backgroundColor: '#22252f',
    zIndex: '1',
  },
  logoutButton: {
    position: 'fixed',
    right: 50,
    width: 100,
    padding: 0,
    height: 40,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0)',
    border: 'none',
    fontSize: '14px',
    textTransform: 'uppercase',
    boxShadow: '0px 1px 6px 0px rgba(255, 255, 255, 0.2)',
    '&:hover': {
      boxShadow: '0px 2px 12px 0px rgba(255, 255, 255, 0.4)',
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
        {portfoliosArray.length > 0 && <PortfolioSelect className={classes.flex} />}
        <Button
          className={classes.logoutButton}
          onClick={() => handleLogout()}
        >
          Log out
        </Button>
      </Toolbar>
    );
  }
}

export default withStyles(styles, headerStyle, buttonStyle)(Header);
