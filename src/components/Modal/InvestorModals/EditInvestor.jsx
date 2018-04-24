import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Input } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';

import Button from '../../CustomButtons/Button';
import SelectInvestor from '../../Selectors/SelectInvestor';


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
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  alignBtn: {
    marginRight: '20px',
  },
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
    this.props.InvestorStore.resetUpdate();
    this.setState({ open: false });
  };

  handleChange = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleEditRequests = propertyType => (event) => {
    event.preventDefault();

    const inputValue = event.target.value;
    this.props.InvestorStore.setInvestorUpdateValues(propertyType, inputValue);
  }

  handleSave = () => {
    const { InvestorStore, PortfolioStore } = this.props;

    InvestorStore.updateCurrentInvestor(InvestorStore.selectedInvestor.id);
    this.handleClose();
  }

  render() {
    const { classes, InvestorStore } = this.props;

    return (
      <Grid container>
        <Button onClick={this.handleOpen} color="primary">
          Edit Investor
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
            <Grid container >
              <Grid item xs={12} sm={12} md={12}>
                <Typography
                  variant="title"
                  id="modal-title"
                  style={{ fontSize: '18px', fontWeight: '400' }}
                >
                  Edit Investor
                </Typography>
              </Grid>
            </Grid>

            <Grid container >
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <SelectInvestor />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <Input
                  type="text"
                  placeholder="Full name"
                  value={InvestorStore.updateInvestorValues.fullName}
                  onChange={this.handleEditRequests('fullName')}
                  className={classes.alignInputAfter}
                  autoFocus
                />

                <Input
                  type="number"
                  placeholder="Telephone"
                  value={InvestorStore.updateInvestorValues.telephone}
                  onChange={this.handleEditRequests('telephone')}
                  className={classes.alignInput}
                />
              </Grid>

              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={InvestorStore.updateInvestorValues.email}
                  onChange={this.handleEditRequests('email')}
                  className={classes.alignInputAfter}
                />

                <Input
                  type="number"
                  placeholder="Management Fee %"
                  value={InvestorStore.updateInvestorValues.managementFee}
                  onChange={this.handleEditRequests('managementFee')}
                  className={classes.alignInput}
                />
              </Grid>
            </Grid>

            <Grid container className={classes.buttonsContainer}>
              <div className={classes.alignBtn}>

                <Button
                  className={classes.alignBtn}
                  color="primary"
                  onClick={this.handleClose}
                >
                Cancel
                </Button>
              </div>

              <Button
                type="submit"
                color="primary"
                onClick={this.handleSave}
              >
                Save
              </Button>
            </Grid>
          </div>
        </Modal>
      </Grid>
    );
  }
}

EditInvestor.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditInvestor);
