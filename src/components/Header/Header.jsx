import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'material-ui-icons';
import {
  withStyles,
  AppBar,
  Toolbar,
  IconButton,
  Hidden,
  Button,
} from 'material-ui';

import cx from 'classnames';
import ControlledOpenSelect from '../PortSelect/PortSelect';
// import CreatePortfolio from '../Modal/CreatePortfolio';
// import UpdatePortfolioModal from '../Modal/UpdatePortfolio';
// import RegularButton from '../CustomButtons/Button';
import buttonStyle from '../../variables/styles/buttonStyle';

import headerStyle from '../../variables/styles/headerStyle.jsx';

import HeaderLinks from './HeaderLinks';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  makeBrand() {
    let name;
    this.props.routes.map((prop, key) => {
      if (prop.path === this.props.location.pathname) {
        name = prop.navbarName;
      }
      return null;
    });
    return name;
  }

  render() {
    console.log('render', this.state.portfolios);
    const { classes, color } = this.props;
    const appBarClasses = cx({
      [` ${classes[color]}`]: color,
    });
    return (
      <AppBar
        className={classes.appBar + appBarClasses}
        style={{ borderBottom: '2px solid #00BCD4' }}
      >
        <Toolbar className={classes.container}>
          <div className={classes.flex}>
            {/* Here we create navbar brand, based on route name */}
            <Hidden mdUp>
              <IconButton
                className={classes.appResponsive}
                color="inherit"
                aria-label="open drawer"
                onClick={this.props.handleDrawerToggle}
              >
                <Menu />
              </IconButton>
            </Hidden>
            <Button href="#" className={classes.title}>
              {this.makeBrand()}
            </Button>
          </div>

          <div className={classes.flex}>
            <Hidden smDown implementation="css">
              <HeaderLinks />
            </Hidden>
          </div>
          <div className={classes.flex}>
            <ControlledOpenSelect />

            {/* <CreatePortfolio /> */}
            {/* <UpdatePortfolioModal />
            <div>
              <RegularButton color="primary" >
                Delete
              </RegularButton>
            </div> */}
          </div>
          <Hidden smDown implementation="css">
            <HeaderLinks />
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
  // handleDrawerToggle: PropTypes.func,
};

export default withStyles(headerStyle, buttonStyle)(Header);
