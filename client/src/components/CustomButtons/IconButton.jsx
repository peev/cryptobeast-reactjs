// @flow
import React from 'react';
import { withStyles, IconButton } from '@material-ui/core';

import iconButtonStyle from './../../variables/styles/iconButtonStyle';

type Props = {
  classes: Object,
  color: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'rose' | 'white' | 'simple',
  customClass: string,
  disabled: boolean,
  children: React.Node,
};

function IconCustomButton({ ...props }: Props) {
  const { classes, color, children, customClass, ...rest } = props;
  return (
    <IconButton
      {...rest}
      className={
        classes.button +
        (color ? ` ${classes[color]}` : '') +
        (customClass ? ` ${classes[customClass]}` : '')
      }
    >
      {children}
    </IconButton>
  );
}


export default withStyles(iconButtonStyle)(IconCustomButton);
