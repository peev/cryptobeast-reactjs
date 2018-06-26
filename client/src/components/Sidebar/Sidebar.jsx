// @flow
import React from 'react';
import uuid from 'uuid/v4';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import {
  withStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from 'material-ui';
import SidebarStyle from './SidebarStyle';

type Props = {
  classes: Object,
  routes: Array<string>,
  disabled: boolean,
  closed: boolean,
};

const Sidebar = ({ ...props }: Props) => {
  const { classes, routes, disabled, closed } = props;

  return (
    <List className={classes.list}>
      {routes.map((prop: Object) => (
        <ListItem
          button
          className={classes.itemLink}
          disabled={disabled}
          key={uuid()}
        >
          <NavLink
            to={prop.path}
            className={`${classes.item} ${!closed ? classes.itemClosed : ''}`}
            activeClassName="active"
          >
            <ListItemIcon className={classes.itemIcon}>
              <prop.icon />
            </ListItemIcon>
            <ListItemText
              primary={prop.sidebarName}
              className={classes.itemText}
              disableTypography
            />
          </NavLink>
        </ListItem>
      ))}
    </List>
  );
};

export default withStyles(SidebarStyle)(withRouter(Sidebar));
