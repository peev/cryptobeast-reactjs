import React from 'react';
import { TextField, Input } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import { inject, observer } from 'mobx-react';

import SelectCurrency from '../../Selectors/SelectCurrency';
import Button from '../../CustomButtons/Button';
import modalStyle from '../../../variables/styles/modalStyle';

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
// const stylesMain = {
//   display: 'flex',
//   // justify: 'flex-end',
//   // alignItems: 'center',
// };

@inject('InvestorStore', 'PortfolioStore')
@observer
class AddInvestor extends React.Component {
  state = {
    open: false,
    managementFeeValue: '',
  };

  componentWillUnmount() {
    this.props.InvestorStore.reset();
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.InvestorStore.reset();

    this.setState({ open: false });
  };

  handleRequests = propertyType => (event) => {
    event.preventDefault();
    const inputValue = event.target.value;

    if (propertyType === 'managementFee' && (inputValue < 0 || inputValue > 100)) {
      console.log('handleRequests --- managementFee');
      return this.setState({ managementFeeValue: '' });
    }

    this.props.InvestorStore.setInvestorValues(propertyType, inputValue);
  }

  handleFounder = name => (event) => {
    this.setState({ [name]: event.target.checked });
    this.props.InvestorStore.setFounder();
  };

  handleSave = () => {
    const { selectedPortfolioId } = this.props.PortfolioStore;
    this.props.InvestorStore.createNewInvestor(selectedPortfolioId);

    this.handleClose();
  }


  render() {
    const { managementFeeValue } = this.state;
    const { classes, InvestorStore } = this.props;

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
            <div
            // stystylesMain
            // className={modalStyle.investorContainer}
            // FIXME: needs classes
            >
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

            <div className={classes.flex}>
              <div>
                <Input
                  placeholder="Full name"
                  onChange={this.handleRequests('fullName')}
                  className={classes.input}
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
                  value={InvestorStore.depositUsdEquiv}
                />

                <Input
                  placeholder="Share price at entry Date"
                  value={InvestorStore.sharePriceAtEntryDate}
                  className={classes.input}
                />
              </div>

              <div style={{ display: 'inline-block' }}>
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

                <SelectCurrency />

                <TextField
                  placeholder="Management Fee %"
                  // value={managementFeeValue}
                  onChange={this.handleRequests('managementFee')}
                />

                <TextField
                  value={InvestorStore.purchasedShares}
                  placeholder="Purchased Shares"
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
              >
                Save
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

// AddInvestor.propTypes = {
//   classes: PropTypes.object,
// };

const AddInvestorWrapped = withStyles(styles, modalStyle)(AddInvestor);

export default AddInvestorWrapped;
