import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Snackbar } from 'material-ui';
import { inject, observer } from 'mobx-react';


const styles = () => ({
  layout: {
    height: 'auto',
    lineHeight: '28px',
    padding: '24',
    whiteSpace: 'pre-line',
  },
});

@inject('ErrorStore')
@observer
class ErrorSnackbar extends React.Component {
  state = {};

  componentDidMount() {
    setTimeout(() => {
      this.props.ErrorStore.resetErrors();
    }, 6000);
  }

  componentWillUpdate() {
    const { ErrorStore } = this.props;

    if (ErrorStore.getErrorsLength > 0) {
      // console.log(ErrorStore.errors)
      setTimeout(() => {
        ErrorStore.resetErrors();
      }, 6000);
    }
  }

  render() {
    const { classes, ErrorStore } = this.props;
    let message = '';

    ErrorStore.errors.forEach(errorMessage => message += `${errorMessage} \n`);

    return (
      <Snackbar
        message={message}
        open={ErrorStore.getErrorsLength > 0}
        className={classes.layout}
      />
    );
  }
}

ErrorSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorSnackbar);
