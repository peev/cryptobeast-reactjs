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
    padding: '0',
    backgroundColor: '#143141',
    zIndex: '1',
  },
  logoutButton: {
    position: 'fixed',
    right: 50,
    // width: 100,
    // padding: 0,
    // height: 40,
    color: '#dee0e2',
    fontSize: '12px',
    textTransform: 'uppercase',
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
