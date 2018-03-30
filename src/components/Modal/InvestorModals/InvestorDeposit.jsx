import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Input, Snackbar } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';

import Button from '../../CustomButtons/Button';
import SelectInvestor from '../../Selectors/SelectInvestor';
import SelectCurrency from '../../Selectors/SelectCurrency';

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
  button: {
    float: 'right',
    display: 'inline-flex',
  },
  container: {
    display: 'flex',
    marginTop: '15px',
    marginBottom: '25px',
  },
  nestedElementLeft: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '20px',
  },
  nestedElementRight: {
    display: 'flex',
    flexDirection: 'column',
  },
});

@inject('InvestorStore')
@observer
class InvestorDeposit extends React.Component {
  state = {
    open: false,
    openNotification: false,
    disabledBtn: false,
  };

  componentWillMount() {
    const { InvestorStore } = this.props;

    InvestorStore.handleNotSelectedPortfolio();

    if (InvestorStore.getAddInvestorErrors.length > 0) {
      this.setState({ openNotification: true, disabledBtn: true });
      setTimeout(() => {
        this.setState({ openNotification: false, disabledBtn: false });
        InvestorStore.resetErrors();
      }, 6000);
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.InvestorStore.resetDeposit();
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
    // InvestorStore.handleEmptyFields;
    const profileChecked = InvestorStore.handleNotSelectedPortfolio();

    // Warnings popup
    if (InvestorStore.getAddInvestorErrors.length > 0) {
      this.setState({ openNotification: true, disabledBtn: true });
      setTimeout(() => {
        InvestorStore.resetErrors();
        this.setState({ openNotification: false, disabledBtn: false });
      }, 6000);
    }

    if (InvestorStore.getAddInvestorErrors.length === 0 && profileChecked) {
      InvestorStore.createNewDepositInvestor(InvestorStore.selectedInvestor.id);
      this.handleClose();
    }
  }

  render() {
    const { classes, InvestorStore } = this.props;
    const investorErrors = InvestorStore.getAddInvestorErrors;
    let errorMessagesArray;

    if (investorErrors.length > 0) {
      let message = '';

      investorErrors.forEach(errorMsg => message += `${errorMsg} \n`);

      errorMessagesArray = (<Snackbar
        message={message}
        open={this.state.openNotification}
        style={{ height: 'auto', lineHeight: '28px', padding: '24', whiteSpace: 'pre-line' }}
      />);
    }

    return (
      <div>
        <div>
          <Button
            onClick={this.handleOpen}
            color="primary"
          >
            Investor Deposit
          </Button>
        </div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <form
            style={getModalStyle()}
            className={classes.paper}
          // onSubmit={() => this.handleDepositSave}
          >
            <Typography
              variant="title"
              id="modal-title"
              style={{ fontSize: '18px', fontWeight: '400' }}
            >
              Investor Deposit
            </Typography>

            <div className={classes.container}>
              <div className={classes.nestedElementLeft}>
                <SelectInvestor />

                <Input
                  type="number"
                  placeholder="Amount"
                  onChange={this.handleDepositRequests('amount')}
                  className={classes.input}
                />

                <Input
                  placeholder="Share Price at Entry Date"
                  className={classes.input}
                  value={InvestorStore.depositSharePriceAtEntryDate}
                />
              </div>

              <div className={classes.nestedElementRight}>
                <Input
                  type="date"
                  placeholder="Transaction Date"
                  onChange={this.handleDepositRequests('transactionDate')}
                  className={classes.input}
                />

                <SelectCurrency />

                <Input
                  placeholder="Purchased Shares"
                  className={classes.input}
                  value={InvestorStore.depositPurchasedShares}
                />
              </div>
            </div>

            <div>
              <Button
                onClick={this.handleClose}
                color="primary"
              >
                Cancel
              </Button>

              <Button
                onClick={this.handleDepositSave}
                color="primary"
                type="submit"
                disabled={this.state.disabledBtn}
              >
                Save
              </Button>
            </div>
          </form>
        </Modal>
        {errorMessagesArray}
      </div>
    );
  }
}

InvestorDeposit.propTypes = {
  classes: PropTypes.object.isRequired,
};

const InvestorDepositWrapped = withStyles(styles)(InvestorDeposit);

export default InvestorDepositWrapped;
