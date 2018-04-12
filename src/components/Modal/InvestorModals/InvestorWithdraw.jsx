import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Input, Snackbar } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';

import Button from '../../CustomButtons/Button';
import SelectInvestor from '../../Selectors/SelectInvestor';


const getModalStyle = () => {
  const top = 20;
  const left = 28;
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
};

const styles = theme => ({
  paper: {
    position: 'absolute',
    minWidth: '100px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4,
  },
  headerContainer: {
    fontSize: '19px',
  },
  containerDirection: {
    display: 'flex',
    flexDirection: 'column',
  },
  alignInput: {
    marginTop: '16px',
  },
  alignInputAfter: {
    marginTop: '10px',
  },
  buttonsContainer: {
    marginTop: '20px',
  },
});

@inject('InvestorStore', 'PortfolioStore')
@observer
class InvestorWithdraw extends React.Component {
  state = {
    open: false,
    openNotification: false,
    disabledBtn: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.InvestorStore.resetWithdrawal();
    this.setState({ open: false });
  };

  handleChange = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleWithdrawRequests = propertyType => (event) => {
    event.preventDefault();
    const { InvestorStore } = this.props;
    const inputValue = event.target.value;
    this.props.InvestorStore.setWithdrawInvestorValues(propertyType, inputValue);

    // To calculate purchased shares ===================
    if (propertyType === 'amount') {
      InvestorStore.depositUsdEquiv();
    }
  }

  handleWithdrawalInvestor = () => {
    const { InvestorStore, PortfolioStore } = this.props;
    // InvestorStore.handleEmptyFields;

    InvestorStore.withdrawalInvestor(InvestorStore.selectedInvestor.id);

    // Warnings popup
    if (InvestorStore.getAddInvestorErrors.length > 0) {
      this.setState({ openNotification: true, disabledBtn: true });
      setTimeout(() => {
        InvestorStore.resetErrors();
        this.setState({ openNotification: false, disabledBtn: false });
      }, 2000);
    } else {
      PortfolioStore.getPortfolios();
      this.handleClose();
    }
  }

  render() {
    const { classes, InvestorStore, PortfolioStore } = this.props;

    const investorErrors = InvestorStore.getAddInvestorErrors;
    let errorMessagesArray;

    if (investorErrors.length > 0) {
      // this.setState({ numberOfErrors: investorErrors.length });

      let message = '';
      investorErrors.forEach(errorMsg => message += `${errorMsg} \n`);

      errorMessagesArray = (<Snackbar
        message={message}
        open={this.state.openNotification}
        style={{ height: 'auto', lineHeight: '28px', padding: '24', whiteSpace: 'pre-line' }}
      />);
    }

    return (
      <Grid container>
        <Button onClick={this.handleOpen} color="primary">
          Investor Withdrawal
        </Button>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <div
            style={getModalStyle()}
            className={classes.paper}
          >
            <Grid container >
              <Grid item xs={12} sm={12} md={12} className={classes.headerContainer}>
                <Typography
                  variant="title"
                  id="modal-title"
                  style={{ fontSize: '18px', fontWeight: '400' }}
                >
                  Investor Withdrawal
                </Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <SelectInvestor />

                <Input
                  type="number"
                  placeholder="Amount"
                  onChange={this.handleWithdrawRequests('amount')}
                  className={classes.alignInputAfter}
                />

                <Input
                  type="number"
                  placeholder="Share Price at Entry Date"
                  className={classes.alignInput}
                  value={PortfolioStore.currentPortfolioSharePrice}
                />
              </Grid>

              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <Input
                  type="date"
                  placeholder="Transaction Date"
                  onChange={this.handleWithdrawRequests('transactionDate')}
                  className={classes.alignInput}
                />

                <Input
                  type="number"
                  placeholder="USD"
                  className={classes.alignInput}
                />

                <Input
                  type="number"
                  placeholder="Purchased Shares"
                  value={InvestorStore.withdrawPurchasedShares}
                  className={classes.alignInput}
                />

                <Input
                  type="number"
                  placeholder="Management Fee"
                  value={InvestorStore.depositManagementFee}
                  className={classes.alignInput}
                />
              </Grid>
            </Grid>

            <Grid container className={classes.buttonsContainer}>
              <Button
                color="primary"
                onClick={this.handleClose}
              >Cancel
              </Button>

              <Button
                type="submit"
                color="primary"
                onClick={this.handleWithdrawalInvestor}
                disabled={this.state.disabledBtn}
              >Save
              </Button>
            </Grid>
          </div>
        </Modal>
        {errorMessagesArray}
      </Grid>
    );
  }
}

InvestorWithdraw.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InvestorWithdraw);
