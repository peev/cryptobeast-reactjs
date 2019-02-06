// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import cx from 'classnames';

import buttonStyle from './../../variables/styles/buttonStyle';

type Props = {
  classes: Object,
  color: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'rose' | 'white' | 'simple' | 'transparent',
  round: boolean,
  fullWidth: boolean,
  disabled: boolean,
  children: React.Node,
};

function InvestorCardButton({ ...props }: Props) {
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

export default withStyles(buttonStyle)(InvestorCardButton);
