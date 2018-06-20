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
  inputWrapperTransactionDate: {
    width: '192px',
    margin: '10px 20px 0',
  },
  inputWrapperSelectBaseCurrency: {
    width: '192px',
    margin: '10px 20px 0',
  },
});

type Props = {
  classes: Object,
  InvestorStore: Object,
  PortfolioStore: Object,
  MarketStore: Object,
};

type State = {
  open: boolean,
};

@inject('InvestorStore', 'PortfolioStore', 'MarketStore', 'NotificationStore')
@observer
class InvestorDeposit extends React.Component<Props, State> {
  state = {
    open: false,
  };

  componentWillMount() {
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
    this.props.InvestorStore.resetDeposit();
    this.props.MarketStore.resetMarket();
    this.props.InvestorStore.resetSelectedInvestor();

    this.setState({ open: false });
  };

  handleChange = (name: string) => (event: SyntheticEvent) => {
    this.setState({ [name]: event.target.checked });
  };

  handleDepositRequests = (propertyType: string) => (event: SyntheticEvent) => {
    event.preventDefault();
    const inputValue = event.target.value;
    this.props.InvestorStore.setNewDepositInvestorValues(propertyType, inputValue);
  }

  handleDepositSave = () => {
    const { InvestorStore } = this.props;
    const noErrors = InvestorStore.handleDepositInvestorErrors();

    if (noErrors) {
      InvestorStore.createNewDepositInvestor(InvestorStore.selectedInvestor.id);
      this.props.InvestorStore.resetSelectedInvestor();
      this.handleClose();
    }
  }

  handleSelectInvestor = (value: *) => {
    this.props.InvestorStore.selectInvestor(value);
  }

  render() {
    const {
      classes, InvestorStore, PortfolioStore, MarketStore,
    } = this.props;
    const today = new Date().toISOString().substring(0, 10);

    return (
      <Grid container>
        <Button
          onClick={this.handleOpen}
          color="primary"
          style={{ fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif' }}
        >
          Investor Deposit
        </Button>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <ValidatorForm
            onSubmit={this.handleDepositSave}
            style={getModalStyle()}
            className={classes.paper}
          >
            <Grid container >
              <Grid item xs={12} sm={12} md={12}>
                <Typography
                  variant="title"
                  id="modal-title"
                  style={{ marginLeft: '20px', fontSize: '18px', fontWeight: '400' }}
                >
                  Investor Deposit
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
              <div className={classes.inputWrapperTransactionDate}>
                <TextValidator
                  name="date"
                  type="date"
                  // label="Transaction Date"
                  onChange={this.handleDepositRequests('transactionDate')}
                  value={InvestorStore.newDepositValues.transactionDate || today}
                  className={classes.alignInput}
                  validators={['required', 'isDateValid']}
                  errorMessages={['this field is required', 'Date must be before today']}
                />
              </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
              <div className={classes.inputWrapper}>
                <TextValidator
                  name="amount"
                  type="number"
                  label="Amount*"
                  onChange={this.handleDepositRequests('amount')}
                  value={InvestorStore.newDepositValues.amount || ''}
                  style={{ width: '95%' }}
                  // className={classes.alignInputAfter}
                  validators={['required', 'isPositive']}
                  errorMessages={['this field is required', 'value must be a positive number']}
                />
              </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
              <div className={classes.inputWrapperSelectBaseCurrency}>
                <SelectBaseCurrency />
              </div>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
              <div className={classes.inputWrapper}>
                <TextValidator
                  disabled
                  name="share price"
                  label="Share Price at Entry Date (USD)"
                  className={classes.alignInputAfter}
                  value={Math.round(PortfolioStore.currentPortfolioSharePrice * 100) / 100 || ''}
                  style={{ width: '95%' }}
                />
              </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
              <div className={classes.inputWrapper}>
                <TextValidator
                  disabled
                  name="purchased shares"
                  placeholder="Purchased Shares"
                  style={{ marginTop: '26px' }}
                  value={InvestorStore.depositPurchasedShares || ''}
                />
              </div>
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
                disabled={InvestorStore.newDepositValues.amount === '' ||
                MarketStore.selectedBaseCurrency == null || InvestorStore.selectedInvestorId === null}
              >
                Save
              </Button>
            </Grid>
          </ValidatorForm>
        </Modal>
        <NotificationSnackbar />
      </Grid >
    );
  }
}

export default withStyles(styles)(InvestorDeposit);
