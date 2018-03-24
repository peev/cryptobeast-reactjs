import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';

import Button from '../../CustomButtons/Button';
import SelectInvestor from '../../Selectors/SelectInvestor';
// import { Icon } from 'material-ui-icons';

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
    marginBottom: '25px',
  },
  selectorWrapper: {
    width: '47.5%',
  },
  nestedElementLeft: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '20px',
  },
  nestedElementRight: {
    display: 'flex',
    flexDirection: 'column',
    // marginTop: '55px',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: '20px',
  }
});

@inject('InvestorStore', 'PortfolioStore')
@observer
class EditInvestor extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.InvestorStore.resetEdit();
    this.setState({ open: false });
  };

  handleChange = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleEditRequests = propertyType => (event) => {
    event.preventDefault();

    const inputValue = event.target.value;
    this.props.InvestorStore.setInvestorEditingValues(propertyType, inputValue);
  }

  handleSave = () => {
    const { InvestorStore, PortfolioStore } = this.props;
    // InvestorStore.handleEmptyFields;

    InvestorStore.createNewDepositInvestor(InvestorStore.selectedInvestor.id);
    PortfolioStore.getPortfolios();
    this.handleClose();
  }

  render() {
    const { classes, InvestorStore } = this.props;

    return (
      <div>
        <div>
          <Button onClick={this.handleOpen} color="primary">
            Edit Investor
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
            onSubmit={() => this.handleSave}
          >
            <Typography
              variant="title"
              id="modal-title"
              style={{ fontSize: '18px', fontWeight: '400' }}
            >
              Edit Investor
            </Typography>

            <div className={classes.selectorWrapper}>
              <SelectInvestor />
            </div>
            <div className={classes.container}>

              <div className={classes.nestedElementLeft}>

                <Input
                  type="text"
                  placeholder="Full name"
                  value={InvestorStore.editedValues.fullName}
                  onChange={this.handleEditRequests('fullName')}
                  className={classes.input}
                  autoFocus
                />

                <Input
                  type="number"
                  placeholder="Telephone"
                  value={InvestorStore.editedValues.telephone}
                  onChange={this.handleEditRequests('telephone')}
                  className={classes.input}
                />
              </div>

              <div className={classes.nestedElementRight}>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={InvestorStore.editedValues.email}
                  onChange={this.handleEditRequests('email')}
                  className={classes.input}
                />

                <Input
                  type="number"
                  placeholder="Management Fee %"
                  value={InvestorStore.editedValues.managementFee}
                  onChange={this.handleEditRequests('managementFee')}
                  className={classes.input}
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
                onClick={this.handleSave}
                color="primary"
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}

EditInvestor.propTypes = {
  classes: PropTypes.object.isRequired,
};

const EditInvestorWrapped = withStyles(styles)(EditInvestor);

export default EditInvestorWrapped;
