import React from 'react';
import { withStyles, Input, Snackbar } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import { inject, observer } from 'mobx-react';

import SelectBaseCurrency from '../../Selectors/SelectBaseCurrency';
import Button from '../../CustomButtons/Button';
import addInvestorModalStyle from '../../../variables/styles/addInvestorModalStyle';

// import { Icon } from 'material-ui-icons';
// import PropTypes from 'prop-types';
// import DatePicker from 'material-ui/DatePicker';

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
    display: 'flex',
    flexDirection: 'column',
    minWidth: '100px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4,
  },
  container: {
    display: 'flex',
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
  headerContainer: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
});

@inject('InvestorStore', 'PortfolioStore', 'MarketStore')
@observer
class AddInvestor extends React.Component {
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

  componentWillUpdate() {
    if (!this.props.InvestorStore.selectedPortfolioId) {
      this.props.InvestorStore.getPortfolio();
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.InvestorStore.reset();
    this.props.InvestorStore.resetErrors();
    this.props.MarketStore.resetMarket();

    this.setState({ open: false });
  };

  handleRequests = propertyType => (event) => {
    event.preventDefault();
    const { InvestorStore } = this.props;
    const inputValue = event.target.value;
    InvestorStore.setNewInvestorValues(propertyType, inputValue);
    if (propertyType === 'depositedAmount') {
      console.log('>>> from handleRequests: ', propertyType);
      InvestorStore.depositUsdEquiv();
    }
  }

  handleFounder = name => (event) => {
    this.setState({ [name]: event.target.checked });
    this.props.InvestorStore.setIsFounder();
  };

  handleSave = () => {
    const { PortfolioStore, InvestorStore } = this.props;

    // FIXME: dont spam Save Button
    const profileChecked = InvestorStore.handleNotSelectedPortfolio();
    InvestorStore.handleEmptyFields;
    InvestorStore.handleAddInvestorErrors();
    const emailChecked = InvestorStore.emailFieldValidation();

    // Warnings popup
    if (InvestorStore.getAddInvestorErrors.length > 0) {
      this.setState({ openNotification: true, disabledBtn: true });
      setTimeout(() => {
        InvestorStore.resetErrors();

        this.setState({ openNotification: false, disabledBtn: false });
      }, 6000);
    }

    console.log('check fields: ', InvestorStore.areFieldsEmpty, emailChecked, profileChecked );
    if (InvestorStore.areFieldsEmpty === false && emailChecked && profileChecked) {
      InvestorStore.createNewInvestor(PortfolioStore.selectedPortfolioId);

      this.handleClose();
    }
  };

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
      <div>
        <div>
          <Button onClick={this.handleOpen} color="primary">
            Add new investor
          </Button>
        </div>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <div
            style={getModalStyle()}
            className={classes.paper}
            onSubmit={() => this.handleSave}
          >
            <div className={classes.headerContainer}>
              <Typography
                variant="title"
                id="modal-title"
                style={{ fontSize: '18px', fontWeight: '400' }}
              >
                Add a new investor
              </Typography>

              <div>
                Founder
                <Checkbox
                  onChange={this.handleFounder('founder')}
                  color="primary"
                />
              </div>
            </div>

            <div className={classes.container}>
              <div className={classes.nestedElementLeft}>
                <Input
                  placeholder="Full name"
                  onChange={this.handleRequests('fullName')}
                  className={classes.input}
                  autoFocus
                />

                <Input
                  type="number"
                  placeholder="Telephone"
                  onChange={this.handleRequests('telephone')}
                  className={classes.input}
                />

                <Input
                  type="number"
                  placeholder="Deposited Amount"
                  onChange={this.handleRequests('depositedAmount')}
                  className={classes.input}
                />

                <Input
                  placeholder="Deposited USD Equiv."
                  className={classes.input}
                  value={InvestorStore.values.depositUsdEquiv}
                />

                <Input
                  placeholder="Share price at entry Date"
                  value={PortfolioStore.currentPortfolioSharePrice}
                  className={classes.input}
                />
              </div>

              <div className={classes.nestedElementRight}>
                <Input
                  type="email"
                  placeholder="Email Address"
                  onChange={this.handleRequests('email')}
                  className={classes.input}
                />

                <Input
                  type="date"
                  placeholder="Date of Entry"
                  onChange={this.handleRequests('dateOfEntry')}
                  className={classes.input}
                />

                <SelectBaseCurrency />

                <Input
                  type="number"
                  placeholder="Management Fee %"
                  value={InvestorStore.values.managementFee}
                  onChange={this.handleRequests('managementFee')}
                  className={classes.input}
                />

                <Input
                  type="number"
                  value={InvestorStore.purchasedShares}
                  placeholder="Purchased Shares"
                  className={classes.input}
                />
              </div>
            </div>

            <div>
              <Button
                style={{ display: 'inline-flex' }}
                onClick={this.handleClose}
                color="primary"
              >
                Cancel
              </Button>

              <Button
                style={{ display: 'inline-flex' }}
                onClick={this.handleSave}
                color="primary"
                type="submit"
                disabled={this.state.disabledBtn}
              >
                Save
              </Button>
            </div>
          </div>
        </Modal>
        {errorMessagesArray}
      </div>
    );
  }
}

// AddInvestor.propTypes = {
//   classes: PropTypes.object,
// };

const AddInvestorWrapped = withStyles(styles, addInvestorModalStyle)(AddInvestor);

export default AddInvestorWrapped;
