import React from 'react';
import { withStyles, Button } from 'material-ui';
import PropTypes from 'prop-types';
import cx from 'classnames';

import buttonStyle from 'variables/styles/buttonStyle';

function InvestorCardButton({ ...props }) {
  const {
    classes,
    color,
    round,
    children,
    fullWidth,
    disabled,
    ...rest
  } = props;
  const btnClasses = cx({
    [classes[color]]: color,
    [classes.round]: round,
    [classes.fullWidth]: fullWidth,
    [classes.disabled]: disabled,
  });
  return (
    <Button {...rest} className={`${classes.investorTopButtons} ${btnClasses}`}>
      {children}
    </Button>
  );
}

InvestorCardButton.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    'primary',
    'info',
    'success',
    'warning',
    'danger',
    'rose',
    'white',
    'simple',
    'transparent',
    
  ]),
  round: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default withStyles(buttonStyle)(InvestorCardButton);
