import React from 'react';
import { withStyles, Input, Snackbar, Grid } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import { inject, observer } from 'mobx-react';

import SelectBaseCurrency from '../../Selectors/SelectBaseCurrency';
import Button from '../../CustomButtons/Button';
import addInvestorModalStyle from '../../../variables/styles/addInvestorModalStyle';


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
  headerContainerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  headerContainerRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  }
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

    console.log('check fields: ', InvestorStore.areFieldsEmpty, emailChecked, profileChecked);
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
      <Grid container>
        <Button onClick={this.handleOpen} color="primary" >
          Add new investor
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
            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.headerContainerLeft}>
                <Typography
                  variant="title"
                  id="modal-title"
                  style={{ fontSize: '18px', fontWeight: '400' }}
                >
                  Add a new investor
                </Typography>
                <div />
              </Grid>

              <Grid item xs={6} sm={6} md={6} className={classes.headerContainerRight}>
                <Typography
                  variant="subheading"
                  style={{ fontSize: '17px', fontWeight: '400' }}
                >
                  Founder
                </Typography>

                <Checkbox
                  onChange={this.handleFounder('founder')}
                  color="primary"
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <Input
                  placeholder="Full name"
                  onChange={this.handleRequests('fullName')}
                  className={classes.alignInput}
                  autoFocus
                />

                <Input
                  type="number"
                  placeholder="Telephone"
                  onChange={this.handleRequests('telephone')}
                  className={classes.alignInput}
                />

                <Input
                  type="number"
                  placeholder="Deposited Amount"
                  onChange={this.handleRequests('depositedAmount')}
                  className={classes.alignInput}
                />

                <Input
                  placeholder="Deposited USD Equiv."
                  className={classes.alignInput}
                  value={InvestorStore.values.depositUsdEquiv}
                />

                <Input
                  placeholder="Share price at entry Date"
                  className={classes.alignInput}
                  value={PortfolioStore.currentPortfolioSharePrice}
                />
              </Grid>

              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <Input
                  type="email"
                  placeholder="Email Address"
                  onChange={this.handleRequests('email')}
                  className={classes.alignInput}
                />

                <Input
                  type="date"
                  placeholder="Date of Entry"
                  onChange={this.handleRequests('dateOfEntry')}
                  className={classes.alignInput}
                />

                <SelectBaseCurrency />

                <Input
                  type="number"
                  placeholder="Management Fee %"
                  value={InvestorStore.values.managementFee}
                  onChange={this.handleRequests('managementFee')}
                  className={classes.alignInputAfter}
                />

                <Input
                  type="number"
                  value={InvestorStore.purchasedShares}
                  placeholder="Purchased Shares"
                  className={classes.alignInput}
                />
              </Grid>
            </Grid>

            <Grid container className={classes.buttonsContainer}>
              <Button
                color="primary"
                onClick={this.handleClose}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                color="primary"
                onClick={this.handleSave}
                disabled={this.state.disabledBtn}
              >
                Save
              </Button>
            </Grid >
          </div>
        </Modal>
        {errorMessagesArray}
      </Grid >
    );
  }
}

export default withStyles(styles, addInvestorModalStyle)(AddInvestor);
