import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, TextField, Input } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';

import Button from '../../CustomButtons/Button';
import SelectInvestor from '../../Selectors/SelectInvestor';
// import { TextField } from 'material-ui';
// import { Icon } from 'material-ui-icons';
// import Select from 'material-ui';

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
    marginTop: '16px',
  },
});

@inject('InvestorStore')
@observer
class InvestorWithdraw extends React.Component {
  state = {
    open: false,
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

    const inputValue = event.target.value;
    this.props.InvestorStore.setWithdrawInvestorValues(propertyType, inputValue);
  }

  handleWithdrawalInvestor = () => {
    const { InvestorStore, PortfolioStore } = this.props;
    // InvestorStore.handleEmptyFields;

    InvestorStore.withdrawalInvestor(InvestorStore.selectedInvestor.id);
    PortfolioStore.getPortfolios();
    this.handleClose();
  }

  render() {
    const { classes, InvestorStore } = this.props;

    return (
      <div>
        <div>
          <Button onClick={this.handleOpen} color="primary">

            Investor Withdrawal
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
            // onSubmit={() => this.handleWithdrawalInvestor}
          >
            <Typography
              variant="title"
              id="modal-title"
              style={{ fontSize: '18px', fontWeight: '400' }}
            >
              Investor Withdrawal
            </Typography>
            <div className={classes.container}>
              <div className={classes.nestedElementLeft}>
                <SelectInvestor />

                <Input
                  type="number"
                  placeholder="Amount"
                  onChange={this.handleWithdrawRequests('amount')}
                  className={classes.input}
                />

                <Input
                  type="number"
                  placeholder="Share Price at Entry Date"
                  value={InvestorStore.withdrawSharePriceAtEntryDate}
                  className={classes.input}
                />
              </div>

              <div className={classes.nestedElementRight}>
                <Input
                  type="date"
                  placeholder="Transaction Date"
                  onChange={this.handleWithdrawRequests('transactionDate')}
                  className={classes.input}
                />

                <Input
                  type="number"
                  placeholder="USD"
                  className={classes.input}
                />

                <Input
                  type="number"
                  placeholder="Purchased Shares"
                  value={InvestorStore.withdrawPurchasedShares}
                  className={classes.input}
                />

                <Input
                  type="number"
                  placeholder="Management Fee"
                  value={InvestorStore.depositManagementFee}
                  className={classes.input}
                />
              </div>
            </div>

            <div>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>

              <Button onClick={this.handleWithdrawalInvestor} color="primary" type="submit">
                Save
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}

InvestorWithdraw.propTypes = {
  classes: PropTypes.object.isRequired
};

const InvestorWithdrawWrapped = withStyles(styles)(InvestorWithdraw);

export default InvestorWithdrawWrapped;
