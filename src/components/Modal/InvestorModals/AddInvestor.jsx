import React from "react";
import { Input } from "material-ui";
import { withStyles } from "material-ui/styles";
import Modal from "material-ui/Modal";
import Typography from "material-ui/Typography";
import Checkbox from "material-ui/Checkbox";
import { inject, observer } from "mobx-react";

import SelectCurrency from "../../Selectors/SelectCurrency";
import Button from "../../CustomButtons/Button";
import addInvestorModalStyle from "../../../variables/styles/addInvestorModalStyle";

// import { Icon } from 'material-ui-icons';
// import PropTypes from 'prop-types';
// import DatePicker from 'material-ui/DatePicker';

const getModalStyle = () => {
  const top = 20;
  const left = 28;
  return {
    top: `${top}%`,
    left: `${left}%`
  };
};

const styles = theme => ({
  paper: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    minWidth: "100px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4
  },
  container: {
    display: 'flex',
    marginBottom: '25px',
  },
  nestedElementLeft: {
    display: "flex",
    flexDirection: "column",
    marginRight: "20px"
  },
  nestedElementRight: {
    display: "flex",
    flexDirection: "column"
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
});

@inject("InvestorStore", "PortfolioStore")
@observer
class AddInvestor extends React.Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.InvestorStore.reset();

    this.setState({ open: false });
  };

  handleRequests = propertyType => event => {
    event.preventDefault();
    const { InvestorStore } = this.props;

    InvestorStore.handleEmptyFields;

    const inputValue = event.target.value;
    InvestorStore.setNewInvestorValues(propertyType, inputValue);
  }

  handleFounder = name => event => {
    this.setState({ [name]: event.target.checked });
    this.props.InvestorStore.setIsFounder();
  };

  handleSave = () => {
    const { PortfolioStore, InvestorStore } = this.props;
    // InvestorStore.handleEmptyFields;

    if (InvestorStore.areFieldsEmpty === false) {
      InvestorStore.createNewInvestor(PortfolioStore.selectedPortfolioId);
      this.handleClose();
    }
  };

  render() {
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
            <div className={classes.headerContainer}>
              <Typography
                variant="title"
                id="modal-title"
                style={{ fontSize: "18px", fontWeight: "400" }}
              >
                Add a new investor
              </Typography>

              <div>
                Founder
                <Checkbox
                  onChange={this.handleFounder("founder")}
                  color="primary"
                />
              </div>
            </div>

            <div className={classes.container}>
              <div className={classes.nestedElementLeft}>
                <Input
                  placeholder="Full name"
                  onChange={this.handleRequests("fullName")}
                  className={classes.input}
                  autoFocus
                />

                <Input
                  type="number"
                  placeholder="Telephone"
                  onChange={this.handleRequests("telephone")}
                  className={classes.input}
                />

                <Input
                  type="number"
                  placeholder="Deposited Amount"
                  onChange={this.handleRequests("depositedAmount")}
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

              <div className={classes.nestedElementRight}>
                <Input
                  type="email"
                  placeholder="Email Address"
                  onChange={this.handleRequests("email")}
                  className={classes.input}
                />

                <Input
                  type="date"
                  placeholder="Date of Entry"
                  onChange={this.handleRequests("dateOfEntry")}
                  className={classes.input}
                />

                <SelectCurrency />

                <Input
                  type="number"
                  placeholder="Management Fee %"
                  value={InvestorStore.values.managementFee}
                  onChange={this.handleRequests("managementFee")}
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
                style={{ display: "inline-flex" }}
                onClick={this.handleClose}
                color="primary"
              >
                Cancel
              </Button>

              <Button
                style={{ display: "inline-flex" }}
                onClick={this.handleSave}
                color="primary"
                type="submit"
                // disabled={InvestorStore.disabledSaveButton}
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

const AddInvestorWrapped = withStyles(styles, addInvestorModalStyle)(
  AddInvestor
);

export default AddInvestorWrapped;
