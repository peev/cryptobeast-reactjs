import React from 'react';
import { TextField } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import { inject, observer } from 'mobx-react';

import SelectCurrency from '../../Selectors/SelectCurrency';
import Button from '../../CustomButtons/Button';

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
    minWidth: '100px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4,
  }
});

@inject('InvestorStore')
@observer
class AddInvestor extends React.Component {
  state = {
    open: false,
  };

  componentWillUnmount() {
    this.props.InvestorStore.reset();
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleRequests = propertyType => (event) => {
    event.preventDefault();
    this.props.InvestorStore.setInvestorValues(propertyType, event.target.value);
  }

  handleFounder = name => (event) => {
    this.setState({ [name]: event.target.checked });
    this.props.InvestorStore.setFounder();
  };

  // handleFullName = ev => this.props.InvestorStore.setFullName(ev.target.value);
  // handleEmail = ev => this.props.InvestorStore.setEmail(ev.target.value);
  // handleTelephone = ev => this.props.InvestorStore.setTelephone(ev.target.value);
  handleDateOfEntry = ev => this.props.InvestorStore.setDateOfEntry(ev.target.value);
  handleDepositedCurrency = (ev) => {
    this.props.InvestorStore.setDepositedCurrency(ev.target.value);
    // handleDepositUsdEquiv = ev => this.props.InvestorStore.setDepositUsdEquiv(ev.target.value);
    // handleManagementFee = ev => this.props.InvestorStore.setManagementFee(ev.target.value);
    // handleSharePriceAtEntryDate = ev => this.props.InvestorStore.setSharePriceAtEntryDate(ev.target.value);
  };
  handleDepositedAmount = ev => this.props.InvestorStore.setDepositedAmount(ev.target.value);
  handlePurchasedShares = ev => this.props.InvestorStore.setPurchasedShares(ev.target.value);

  handleSave = () => {
    this.props.InvestorStore.createNewInvestor();
  }


  render() {
    const { classes } = this.props;

    return (
      <div>
        <div>
          <Button onClick={this.handleOpen} color="primary">
            {' '}
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
            <Typography
              variant="title"
              id="modal-title"
              style={{ fontSize: '18px', fontWeight: '400' }}
            >
              Add a new investor
              <Checkbox
                checked={this.state.founder}
                onChange={this.handleFounder('founder')}
                color="primary"
              />
            </Typography>
            <div className={classes.flex}>
              <div style={{ display: 'inline-block', marginRight: '10px' }}>
                <TextField
                  placeholder="Full name"
                  onChange={this.handleRequests('fullName')}
                />
                <br />
                <TextField
                  placeholder="Telephone"
                  onChange={this.handleRequests('telephone')}
                />
                <br />
                <TextField
                  placeholder="Depositet Amount"
                  onChange={this.handleRequests('depositedAmount')}
                />
                <br />
                <TextField
                  placeholder="Deposited USD Equiv."
                // TODO
                />
                <br />
                <TextField placeholder="Share price at entry Date" />
              </div>
              <div style={{ display: 'inline-block' }}>
                <TextField
                  placeholder="Email Adress"
                  onChange={this.handleRequests('email')}
                />
                <br />
                <TextField
                  placeholder="Date of Entry"
                // TODO
                />

                <br />

                <SelectCurrency />

                <TextField
                  placeholder="Management Fee %"
                // TODO
                />
                <br />
                <TextField
                  placeholder="Purchased Shares"
                // TODO
                />
              </div>
            </div>

            <br />

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
            >
              {' '}
              Save
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

// AddInvestor.propTypes = {
//   classes: PropTypes.object,
// };

const AddInvestorWrapped = withStyles(styles)(AddInvestor);

export default AddInvestorWrapped;
