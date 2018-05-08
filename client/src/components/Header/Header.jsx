// @flow
import React, { Component } from 'react';
import { withStyles, Toolbar } from 'material-ui';
import { inject, observer } from 'mobx-react';

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

    return (
      <Toolbar className={classes.headerContainer}>
        {portfoliosArray.length > 0 && <PortfolioSelect />}
      </Toolbar>
    );
  }
}

export default withStyles(styles, headerStyle, buttonStyle)(Header);
