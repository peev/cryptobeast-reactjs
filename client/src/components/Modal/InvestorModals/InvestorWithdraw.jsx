// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, Grid } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';
import IconButton from 'material-ui/IconButton';
import Input, { InputAdornment } from 'material-ui/Input';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

import Button from '../../CustomButtons/Button';
import SelectInvestor from '../../Selectors/SelectInvestor';
import SelectBaseCurrency from '../../Selectors/SelectBaseCurrency';
import NotificationSnackbar from '../../Modal/NotificationSnackbar';
import MarketStore from '../../../stores/MarketStore';


const getModalStyle = () => {
  const top = 35;
  const left = 35;
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
};

const styles = (theme: Object) => ({
  paper: {
    position: 'absolute',
    minWidth: '100px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '-1px 13px 57px 16px rgba(0,0,0,0.21)',
    padding: '40px',
  },
  headerContainer: {
    fontSize: '19px',
  },
  containerDirection: {
    display: 'flex',
    flexDirection: 'column',
  },
  alignInput: {
    width: '100%',
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
  inputWrapper: {
    width: '200px',
    margin: '10px 20px 0',
  },
  inputWrapperBalancer: {
    width: '200px',
    margin: '5px 20px 0',
  },
  inputWrapperSelectBaseCurrency: {
    width: '192px',
    margin: '5px 20px 0',
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
      this.handleClose();
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
            <Grid container >
              <Grid item xs={12} sm={12} md={12} className={classes.headerContainer}>
                <Typography
                  variant="title"
                  id="modal-title"
                  style={{ marginLeft: '20px', fontSize: '18px', fontWeight: '400' }}
                >
                  Investor Withdrawal
                </Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapper}>
                  <SelectInvestor
                    value={InvestorStore.selectedInvestorId || ''}
                    handleChange={this.handleSelectInvestor}
                    style={{
                      marginTop: '12px',
                      width: '95%',
                      border: 'none',
                      borderRadius: 0,
                      borderBottom: '1px solid #757575',
                    }}
                  />
                </div>
              </Grid>

              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapper}>
                  <TextValidator
                    name="date"
                    type="date"
                    // label="Transaction Date"
                    onChange={this.handleWithdrawRequests('transactionDate')}
                    value={InvestorStore.withdrawalValues.transactionDate || today}
                    className={classes.alignInput}
                    validators={['required', 'isDateValid']}
                    errorMessages={['this field is required', 'Date must be before today']}
                  />
                </div>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapperSelectBaseCurrency}>
                  <SelectBaseCurrency />
                </div>
              </Grid>

              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapper}>
                  <Input
                    name="amount"
                    type="number"
                    placeholder="Amount*"
                    onChange={this.handleWithdrawRequests('amount')}
                    value={InvestorStore.withdrawalValues.amount || ''}
                    className={classes.alignInput}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={this.handleWithdrawAllShares}
                        >
                          {<KeyboardArrowUp />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </div>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapperBalancer}>
                  <TextValidator
                    disabled
                    name="share price"
                    label="Share Price at Entry Date (USD)"
                    className={classes.alignInput}
                    value={Math.round(PortfolioStore.currentPortfolioSharePrice * 100) / 100 || ''}
                    style={{ width: '95%' }}
                  />
                </div>
              </Grid>

              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapperBalancer}>
                  <TextValidator
                    disabled
                    name="shares2"
                    type="number"
                    label="Shares"
                    value={InvestorStore.withdrawPurchasedShares || ''}
                    className={classes.alignInput}
                  />
                </div>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection} />
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapperBalancer}>
                  <TextValidator
                    disabled
                    name="fee"
                    label="Management Fee"
                    value={`$${Math.round((InvestorStore.convertedUsdEquiv / 100) * InvestorStore.withdrawManagementFee * 100) / 100 || ''}`}
                    className={classes.alignInput}
                  />
                </div>
              </Grid>
            </Grid>

            <Grid container className={classes.buttonsContainer}>
              <div className={classes.alignBtn}>
                <Button
                  color="primary"
                  onClick={this.handleClose}
                >Cancel
                </Button>
              </div>
              <Button
                type="submit"
                color="primary"
                disabled={NotificationStore.getErrorsLength > 0 || InvestorStore.withdrawalValues.amount === '' ||
                  InvestorStore.selectedInvestorId === null || NotificationStore.getInfoLength > 0}
              >Save
              </Button>
            </Grid>
          </ValidatorForm>
        </Modal>

        <NotificationSnackbar />
      </Grid>
    );
  }
}

export default withStyles(styles)(InvestorWithdraw);
