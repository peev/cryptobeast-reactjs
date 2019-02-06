// @flow
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import { inject, observer } from 'mobx-react';

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
        {portfoliosArray.length > 0 && <PortfolioSelect className={classes.flex} />}
      </Toolbar>
    );
  }
}

export default withStyles(styles, headerStyle, buttonStyle)(Header);
