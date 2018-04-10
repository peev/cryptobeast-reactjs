import React from 'react';
import { withStyles, IconButton } from 'material-ui';
import PropTypes from 'prop-types';
import { Edit } from 'material-ui-icons';

import iconButtonStyle from 'variables/styles/iconButtonStyle';


function ExportPdfButton({ ...props }) {
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

ExportPdfButton.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    'primary',
    'info',
    'success',
    'warning',
    'danger',
    'rose',
    'white',
    'simple'
  ]),
  customClass: PropTypes.string,
  disabled: PropTypes.bool
};

export default withStyles(iconButtonStyle)(ExportPdfButton);
