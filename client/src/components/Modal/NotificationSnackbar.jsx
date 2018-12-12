// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import Warning from '@material-ui/icons/Warning';
import Done from '@material-ui/icons/Done';
import Info from '@material-ui/icons/Info';
import { Snackbar } from './../../components';


const styles = () => ({
  item: {
    height: 'auto',
    lineHeight: '28px',
    padding: '24',
    whiteSpace: 'pre-line',
  },
});

type Props = {
  classes: Object,
  NotificationStore: Object,
};

const NotificationSnackbar = inject('NotificationStore')(observer(({ ...props }: Props) => {
  const { classes, NotificationStore } = props;

  const place = 'tr';
  const dangerColor = 'danger';
  const successColor = 'success';
  const infoColor = 'info';
  let errorMessage = '';
  let successMessage = '';
  let infoMessage = '';

  NotificationStore.errorMessages.forEach((message: string) => errorMessage += `${message} \n`); // eslint-disable-line
  NotificationStore.successMessages.forEach((message: string) => successMessage += `${message} \n`); // eslint-disable-line
  NotificationStore.infoMessages.forEach((message: string) => infoMessage += `${message} \n`); // eslint-disable-line

  return (
    <React.Fragment>
      <Snackbar
        message={errorMessage}
        open={NotificationStore.getErrorsLength > 0}
        className={classes.layout}
        place={place}
        icon={Warning}
        color={dangerColor}
      />
      <Snackbar
        message={successMessage}
        open={NotificationStore.getSuccessLength > 0}
        className={classes.layout}
        place={place}
        icon={Done}
        color={successColor}
      />
      <Snackbar
        message={infoMessage}
        open={NotificationStore.getInfoLength > 0}
        className={classes.layout}
        place={place}
        icon={Info}
        color={infoColor}
      />
    </React.Fragment>
  );
}));

export default withStyles(styles)(NotificationSnackbar);
