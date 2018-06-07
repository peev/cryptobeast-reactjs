// @flow
import React from 'react';
import uuid from 'uuid/v4';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import { withRouter } from 'react-router';
import {
  withStyles,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from 'material-ui';
import sidebarStyle from './../../variables/styles/sidebarStyle';

type Props = {
  classes: Object,
  location: Object,
  color: string,
  image: string,
  routes: Array<string>,
  handleDrawerToggle: Function,
  open: boolean,
  disabled: boolean,
};

const Sidebar = ({ ...props }: Props) => {
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName: string) {
    return props.location.pathname.indexOf(routeName) > -1;
  }
  const { classes, color, image, routes, disabled } = props;

  const links = (
    <List className={classes.list}>
      {routes.map((prop: Object) => {
        const listItemClasses = cx({
          [` ${classes[color]}`]: activeRoute(prop.path),
        });

        const whiteFontClasses = cx({
          [` ${classes.whiteFont}`]: activeRoute(prop.path),
        });

        return (
          <NavLink
            to={prop.path}
            className={classes.item}
            activeClassName="active"
            key={uuid()}
          >
            <ListItem
              button
              className={classes.itemLink + listItemClasses}
              disabled={disabled}
            >
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
          variant="temporary"
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
          variant="permanent"
          open
          classes={{
            paper: `${classes.drawerPaper} ${(disabled ? classes.disableOverlay : '')}`,
          }}
        >
          <div className={classes.sidebarWrapper}>{links}</div>
        </Drawer>
      </Hidden>
    </div>
  );
};

export default withStyles(sidebarStyle)(withRouter(Sidebar));
