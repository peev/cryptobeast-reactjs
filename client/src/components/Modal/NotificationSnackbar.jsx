// @flow
import React from 'react';
import { withStyles } from 'material-ui';
import { inject, observer } from 'mobx-react';
import { Warning, Done } from '@material-ui/icons';
import { Snackbar } from './../../components';


// const styles = () => ({
//   layout: {
//     height: 'auto',
//     lineHeight: '28px',
//     padding: '24',
//     whiteSpace: 'pre-line',
//   },
// });

type Props = {
  classes: Object,
  NotificationStore: Object,
};

@inject('NotificationStore')
@observer
class NotificationSnackbar extends React.Component<Props> {
  state = {};

  componentDidMount() {
    setTimeout(() => {
      this.props.NotificationStore.resetMessages();
    }, 6000);
  }

  componentWillUpdate() {
    const { NotificationStore } = this.props;

    if (NotificationStore.getErrorsLength > 0 || NotificationStore.getSuccessLength > 0) {
      setTimeout(() => {
        NotificationStore.resetMessages();
      }, 6000);
    }
  }

  render() {
    const { classes, NotificationStore } = this.props;
    const place = 'tr';
    const dangerColor = 'danger';
    const successColor = 'success';
    let errorMessage = '';
    let successMessage = '';
    NotificationStore.errorMessages.forEach((message: string) => errorMessage += `${message} \n`); // eslint-disable-line
    NotificationStore.successMessages.forEach((message: string) => successMessage += `${message} \n`); // eslint-disable-line

    return (
      <div>
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
      </div>
    );
  }
}

export default withStyles()(NotificationSnackbar);