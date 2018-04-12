import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Toolbar } from 'material-ui';
import { inject, observer } from 'mobx-react';

import PortfolioSelect from '../Selectors/PortfolioSelect/PortfolioSelect';
import buttonStyle from '../../variables/styles/buttonStyle';
import headerStyle from '../../variables/styles/headerStyle.jsx';


const styles = () => ({
  headerContainer: {
    position: 'fixed',
    width: '100%',
    paddingLeft: '0px',
    backgroundColor: '#22252f',
    zIndex: '1',
  },
});

@inject('PortfolioStore')
@observer
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, PortfolioStore } = this.props;
    const portfoliosArray = Object.keys(PortfolioStore.getAllPortfolios);

    return (
      <Toolbar className={classes.headerContainer}>
        {portfoliosArray.length > 0 ? <PortfolioSelect /> : ''}
      </Toolbar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
  // handleDrawerToggle: PropTypes.func,
};

export default withStyles(styles, headerStyle, buttonStyle)(Header);
