// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import iconButtonStyle from './../../variables/styles/iconButtonStyle';

type Props = {
  classes: Object,
  color: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'rose' | 'white' | 'simple',
  customClass: string,
  disabled: boolean,
  children: React.Node,
};

function ExportPdfButton({ ...props }: Props) {
  const { classes, children, ...rest } = props;

  return (
    <IconButton
      {...rest}
      className={`${classes.makePDF} ${classes.primary}`}
    >
      <Edit />
    </IconButton>
  );
}

export default withStyles(iconButtonStyle)(ExportPdfButton);
