// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, Grid } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Button from '../../CustomButtons/Button';
import SelectInvestor from '../../Selectors/SelectInvestor';
import SelectBaseCurrency from '../../Selectors/SelectBaseCurrency';
import NotificationSnackbar from '../../Modal/NotificationSnackbar';
import MarketStore from '../../../stores/MarketStore';
import DisplayInformation from '../../Cards/Investors/DisplayInformation';


const getModalStyle = () => {
  const top = 25;
  const left = 35;
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
};

const styles = (theme: Object) => ({
  paper: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    width: '550px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '-1px 13px 57px 16px rgba(0,0,0,0.21)',
    padding: '30px',
  },
  paperContainer: {
    margin: '0 -40px',
  },
  gridColumn: {
    width: '50%',
  },
  gridRow: {
    padding: '10px 40px 0 40px',
  },
  inputStyle: {
    width: '100%',
    textTransform: 'uppercase',
    '& input, & label': {
      paddingLeft: '10px',
      paddingRight: '10px',
      fontSize: '14px',
    },
    '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
      display: 'none',
    },
  },
  dateOfEntry: {
    width: '100%',
    marginTop: '16px',
    '& input': {
      paddingLeft: '10px',
      paddingRight: '13px',
    },
    '& input[type=date]::-webkit-inner-spin-button, & input[type=date]::-webkit-outer-spin-button': {
      display: 'none',
    },
    '& input[type=date]::-webkit-clear-button': {
      display: 'none',
    },
    '& input[type=date]::-webkit-calendar-picker-indicator': {
      position: 'relative',
      fontSize: '12px',
      top: '-4px',
      padding: '1px',
      color: 'transparent',
      border: 'solid #999',
      borderWidth: '0 1px 1px 0',
      transform: 'rotate(45deg)',
      '&:hover': {
        backgroundColor: '#fff',
        cursor: 'pointer',
      },
    },
  },
  selectBaseCurrency: {
    width: '75%',
    textTransform: 'uppercase',
    fontSize: '13px',
  },
});

type Props = {
  classes: Object,
  InvestorStore: Object,
  NotificationStore: Object,
  PortfolioStore: Object,
  // MarketStore: Object,
};

type State = {
  open: boolean,
};

@inject('InvestorStore', 'PortfolioStore', 'NotificationStore')
@observer
class InvestorWithdraw extends React.Component<Props, State> {
  state = {
    open: false,
  };

  componentDidMount() {
    ValidatorForm.addValidationRule('isDateValid', (value: string) => {
      if (new Date(value) > Date.now()) {
        return false;
      }
      return true;
    });
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.InvestorStore.resetWithdrawal();
    this.props.InvestorStore.resetSelectedInvestor();
    this.setState({ open: false });
  };

  handleChange = (name: string) => (event: SyntheticEvent) => {
    this.setState({ [name]: event.target.checked });
  };

  handleWithdrawRequests = (propertyType: string) => (event: SyntheticEvent) => {
    event.preventDefault();
    const inputValue = event.target.value;
    this.props.InvestorStore.setWithdrawInvestorValues(propertyType, inputValue);
  }

  handleWithdrawAllShares = () => {
    if (MarketStore.selectedBaseCurrency != null) {
      this.props.InvestorStore.withdrawAllShares();
    }
  }

  handleSelectInvestor = (value: *) => {
    this.props.InvestorStore.selectInvestor(value);
  }

  handleWithdrawalInvestor = () => {
    const { InvestorStore } = this.props;
    const hasErrors = InvestorStore.handleWithdrawalInvestorErrors();

    if (hasErrors) {
      InvestorStore.withdrawalInvestor(InvestorStore.selectedInvestor.id);
      this.setState({ open: false });
    }
  }

  render() {
    const {
      classes, InvestorStore, PortfolioStore, NotificationStore,
    } = this.props;
    const today = new Date().toISOString().substring(0, 10);
    return (
      <Grid container>
        <Button onClick={this.handleOpen} color="primary" style={{ fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif' }}>
          Investor Withdrawal
        </Button>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <ValidatorForm
            onSubmit={this.handleWithdrawalInvestor}
            style={getModalStyle()}
            className={classes.paper}
          >
            <div className={classes.paperContainer}>
              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <Typography
                      variant="title"
                      id="modal-title"
                      style={{
                        fontSize: '18px',
                        fontWeight: '400',
                        // paddingLeft: '10px',
                        fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
                        textTransform: 'uppercase',
                      }}
                    >
                      Investor Withdrawal
                    </Typography>
                  </div>
                </Grid>
              </Grid>

              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <SelectInvestor
                      value={InvestorStore.selectedInvestorId || ''}
                      handleChange={this.handleSelectInvestor}
                      style={{
                        marginTop: '12px',
                        border: 'none',
                        borderRadius: 0,
                        borderBottom: '1px solid #757575',
                        textTransform: 'uppercase',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                </Grid>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextValidator
                      name="date"
                      type="date"
                      // label="Transaction Date"
                      onChange={this.handleWithdrawRequests('transactionDate')}
                      value={InvestorStore.withdrawalValues.transactionDate || today}
                      className={`${classes.alignInput} ${classes.dateOfEntry}`}
                      validators={['required', 'isDateValid']}
                      errorMessages={['this field is required', 'Date must be before today']}
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={`${classes.selectBaseCurrency} ${classes.gridRow}`}>
                    <SelectBaseCurrency />
                  </div>
                </Grid>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextValidator
                      label="Amount*"
                      onChange={this.handleWithdrawRequests('amount')}
                      name="amount"
                      // type="number"
                      className={classes.inputStyle}
                      value={InvestorStore.withdrawalValues.amount || ''}
                      validators={['required', 'isPositive']}
                      errorMessages={['this field is required', 'value must be a positive number']}
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <DisplayInformation
                      value={`$${Math.round(PortfolioStore.currentPortfolioSharePrice * 100) / 100}`}
                      placeholderText="share price at exit date"
                    />
                  </div>
                </Grid>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <DisplayInformation
                      value={`${Math.round(InvestorStore.withdrawPurchasedShares * 1000000) / 1000000 || '0'}`}
                      placeholderText="shares"
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid className={classes.gridColumn}>
                <div className={classes.gridRow}>
                  <DisplayInformation
                    value={`$${Math.round((InvestorStore.convertedUsdEquiv() / 100) * InvestorStore.withdrawManagementFee * 100) / 100 || '0'}`}
                    placeholderText="Management Fee"
                  />
                </div>
              </Grid>

              <Grid container justify="flex-end">
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow} style={{ textAlign: 'right' }}>
                    <Button
                      color="primary"
                      onClick={this.handleClose}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      color="primary"
                      disabled={NotificationStore.getErrorsLength > 0}
                      style={{ marginLeft: '25px' }}
                    >
                      Save
                    </Button>
                  </div>
                </Grid>
              </Grid >
            </div>
          </ValidatorForm>
        </Modal>

        <NotificationSnackbar />
      </Grid>
    );
  }
}

export default withStyles(styles)(InvestorWithdraw);
