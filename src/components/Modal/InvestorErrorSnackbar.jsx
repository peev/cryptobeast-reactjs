import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';
import { inject, observer } from 'mobx-react';


const styles = () => ({
  layout: {
    height: 'auto',
    lineHeight: '28px',
    padding: '24',
    whiteSpace: 'pre-line',
  },
});

@inject('InvestorStore')
@observer
class InvestorErrorSnackbar extends React.Component {
  state = {
    openNotification: false,
  };

  handleTimer = () => {
    const { InvestorStore } = this.props;

    this.setState({ openNotification: true });
    setTimeout(() => {
      InvestorStore.resetErrors();
      this.setState({ openNotification: false });
    }, 6000);
  }

  render() {
    const { classes, InvestorStore, openNotification } = this.props;
    const investorErrors = InvestorStore.getAddInvestorErrors;
    let message = '';

    if (investorErrors.length > 0) {
      investorErrors.forEach(errorMsg => message += `${errorMsg} \n`);

      // this.setState({ openNotification: true });
      // this.handleTimer();
    }

    return (
      <Snackbar
        message={message}
        open={openNotification}
        className={classes.layout}
      />
    );
  }
}

InvestorErrorSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InvestorErrorSnackbar);
