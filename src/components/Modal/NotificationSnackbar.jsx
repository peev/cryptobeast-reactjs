import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';
import { Snackbar } from 'components';
import { inject, observer } from 'mobx-react';
import { Warning, Done } from '@material-ui/icons';


// const styles = () => ({
//   layout: {
//     height: 'auto',
//     lineHeight: '28px',
//     padding: '24',
//     whiteSpace: 'pre-line',
//   },
// });

@inject('NotificationStore')
@observer
class NotificationSnackbar extends React.Component {
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
    NotificationStore.errorMessages.forEach(message => errorMessage += `${message} \n`);
    NotificationStore.successMessages.forEach(message => successMessage += `${message} \n`);

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

NotificationSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles()(NotificationSnackbar);
