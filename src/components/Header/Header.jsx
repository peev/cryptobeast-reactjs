<<<<<<< HEAD
import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'material-ui-icons';
import CreatePortfolio from '../Modal/CreatePortfolio';
import UpdatePortfolioModal from '../Modal/UpdatePortfolio';
import buttonStyle from '../../variables/styles/buttonStyle';
import RegularButton from '../CustomButtons/Button';
=======
import React from "react";
import PropTypes from "prop-types";
import { Menu } from "material-ui-icons";
import Modal from '../Modal/Modal';
import ControlledOpenSelect from '../PortSelect/PortSelect';
>>>>>>> faaa2d9bb674ec6ba2e4d65144b11818fd6a25ef
import {
  withStyles,
  AppBar,
  Toolbar,
  IconButton,
  Hidden,
  Button,

<<<<<<< HEAD
} from 'material-ui';
import cx from 'classnames';
import ControlledOpenSelect from '../PortSelect/PortSelect';

import headerStyle from 'variables/styles/headerStyle.jsx';
=======
} from "material-ui";
import cx from "classnames";

import headerStyle from "variables/styles/headerStyle";
>>>>>>> faaa2d9bb674ec6ba2e4d65144b11818fd6a25ef

import HeaderLinks from './HeaderLinks';


function Header({ ...props }) {
  function makeBrand() {
    let name;
    props.routes.map((prop, key) => {
      if (prop.path === props.location.pathname) {
        name = prop.navbarName;
      }
      return null;
    });
    return name;
  }
  const { classes, color } = props;
  const appBarClasses = cx({
    [` ${classes[color]}`]: color,
  });
  return (
    <AppBar className={classes.appBar + appBarClasses} style={{ borderBottom: '2px solid #00BCD4' }}>
      <Toolbar className={classes.container}>
<<<<<<< HEAD
=======
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button href="#" className={classes.title}>
            {makeBrand()}
          </Button>
        </div>
        <ControlledOpenSelect />

        <Modal />
        <Hidden smDown implementation="css">
          <HeaderLinks />
        </Hidden>
>>>>>>> faaa2d9bb674ec6ba2e4d65144b11818fd6a25ef
        <Hidden mdUp>
          <IconButton
            className={classes.appResponsive}
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
        <div
          className={classes.flex}

        >


          <ControlledOpenSelect />

          <CreatePortfolio />
          <UpdatePortfolioModal />
          <div>
            <RegularButton color="primary" >
              Delete
            </RegularButton>
          </div>
        </div>
        <Hidden smDown implementation="css">
          <HeaderLinks />
        </Hidden>

      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
};

export default withStyles(headerStyle, buttonStyle)(Header);
