import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

// import { Menu } from 'material-ui-icons';
import cx from 'classnames';
import {
  withStyles,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  // IconButton,
} from 'material-ui';

import { HeaderLinks } from 'components';

import sidebarStyle from 'variables/styles/sidebarStyle.jsx';

const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return props.location.pathname.indexOf(routeName) > -1;
  }
  const {
    classes, color, image, routes,
    // logo, logoText,
  } = props;
  const links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        if (prop.redirect) return null;

        const listItemClasses = cx({
          [' ' + classes[color]]: activeRoute(prop.path),
        });

        const whiteFontClasses = cx({
          [' ' + classes.whiteFont]: activeRoute(prop.path),
        });

        return (
          <NavLink
            to={prop.path}
            className={classes.item}
            activeClassName="active"
            key={key}
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
              <ListItemIcon className={classes.itemIcon + whiteFontClasses}>
                <prop.icon />
              </ListItemIcon>
              <ListItemText
                primary={prop.sidebarName}
                className={classes.itemText + whiteFontClasses}
                disableTypography
              />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );
  
  return (
    <div>
      <Hidden mdUp>
        <Drawer
          type="temporary"
          anchor="left"
          open={props.open}
          classes={{
            paper: classes.drawerPaper,
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >

          <div className={classes.sidebarWrapper}>
            <HeaderLinks />
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          anchor="left"
          type="permanent"
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.sidebarWrapper}>{links}</div>
        </Drawer>
      </Hidden>
    </div>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(sidebarStyle)(Sidebar);
