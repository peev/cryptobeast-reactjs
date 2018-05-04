import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Input, Grid } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Button from '../../CustomButtons/Button';
import SelectInvestor from '../../Selectors/SelectInvestor';
import SelectBaseCurrency from '../../Selectors/SelectBaseCurrency';
import NotificationSnackbar from '../../Modal/NotificationSnackbar';

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
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  alignBtn: {
    marginRight: '20px',
  },
});

@inject('InvestorStore', 'PortfolioStore', 'MarketStore', 'NotificationStore')
@observer
class InvestorDeposit extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.InvestorStore.resetDeposit();
    this.props.MarketStore.resetMarket();

    this.setState({ open: false });
  };

  handleChange = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleDepositRequests = propertyType => (event) => {
    event.preventDefault();

    const inputValue = event.target.value;
    this.props.InvestorStore.setNewDepositInvestorValues(propertyType, inputValue);
  }

  handleDepositSave = () => {
    const { InvestorStore } = this.props;
    const noErrors = InvestorStore.handleDepositInvestorErrors();

    if (noErrors) {
      InvestorStore.createNewDepositInvestor(InvestorStore.selectedInvestor.id);
      this.handleClose();
    }
  }

  render() {
    const {
      classes, InvestorStore, PortfolioStore, NotificationStore,
    } = this.props;

    return (
      <Grid container>
        <Button
          onClick={this.handleOpen}
          color="primary"
        >
          Investor Deposit
        </Button>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <ValidatorForm
            // ref="form"
            onSubmit={this.handleDepositSave}
            onError={errors => console.log(errors)}
            style={getModalStyle()}
            className={classes.paper}
          >
            <Grid container >
              <Grid item xs={12} sm={12} md={12}>
                <Typography
                  variant="title"
                  id="modal-title"
                  style={{ fontSize: '18px', fontWeight: '400' }}
                >
                  Investor Deposit
                </Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <SelectInvestor />
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <TextValidator
                  name="date"
                  type="date"
                  // label="Transaction Date"
                  onChange={this.handleDepositRequests('transactionDate')}
                  value={InvestorStore.newDepositValues.transactionDate || ''}
                  className={classes.alignInput}
                  validators={['required']}
                  errorMessages={['this field is required']}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <TextValidator
                  name="amount"
                  type="number"
                  label="Amount"
                  onChange={this.handleDepositRequests('amount')}
                  value={InvestorStore.newDepositValues.amount || ''}
                  // className={classes.alignInputAfter}
                  validators={['required', 'isPositive']}
                  errorMessages={['this field is required', 'value must be a positive number']}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <SelectBaseCurrency />
              </Grid>
              {/* <Input
                placeholder="Share Price at Entry Date"
                className={classes.alignInput}
                value={PortfolioStore.currentPortfolioSharePrice || ''}
              /> */}
            </Grid>

            <Grid container>
              {/* <Input
                type="date"
                placeholder="Transaction Date"
                onChange={this.handleDepositRequests('transactionDate')}
                className={classes.alignInput}
              /> */}

              {/* <SelectBaseCurrency /> */}
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <Input
                  placeholder="Share Price at Entry Date"
                  className={classes.alignInputAfter}
                  value={PortfolioStore.currentPortfolioSharePrice || ''}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <Input
                  placeholder="Purchased Shares"
                  className={classes.alignInputAfter}
                  value={InvestorStore.depositPurchasedShares || ''}
                />
              </Grid>
            </Grid>

            <Grid container className={classes.buttonsContainer}>
              <div className={classes.alignBtn}>
                <Button
                  color="primary"
                  onClick={this.handleClose}
                >
                Cancel
                </Button>
              </div>
              <Button
                type="submit"
                color="primary"
                disabled={NotificationStore.getErrorsLength > 0}
              >
                Save
              </Button>
            </Grid>
          </ValidatorForm>
        </Modal>
        {/* {errorMessagesArray} */}
        <NotificationSnackbar />
      </Grid >
    );
  }
}

InvestorDeposit.propTypes = {
  classes: PropTypes.object.isRequired,
  InvestorStore: PropTypes.object,
  NotificationStore: PropTypes.object,
  PortfolioStore: PropTypes.object,
  MarketStore: PropTypes.object,
};

export default withStyles(styles)(InvestorDeposit);
