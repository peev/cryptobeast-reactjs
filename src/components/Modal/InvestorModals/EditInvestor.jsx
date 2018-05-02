import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

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
    const { InvestorStore } = this.props;

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
          <ValidatorForm
            onSubmit={this.handleSave}
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
                <TextValidator
                  name="name"
                  type="text"
                  label="Full name"
                  value={InvestorStore.updateInvestorValues.fullName}
                  onChange={this.handleEditRequests('fullName')}
                  className={classes.alignInputAfter}
                  autoFocus
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <TextValidator
                  name="email"
                  type="email"
                  label="Email Address"
                  value={InvestorStore.updateInvestorValues.email}
                  onChange={this.handleEditRequests('email')}
                  className={classes.alignInputAfter}
                  validators={['isEmail']}
                  errorMessages={['email is not valid']}
                />

              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <TextValidator
                  name="phone"
                  type="number"
                  label="Telephone"
                  value={InvestorStore.updateInvestorValues.telephone}
                  onChange={this.handleEditRequests('telephone')}
                  className={classes.alignInput}
                  validators={['isNumber']}
                  errorMessages={['telephone is not valid']}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <TextValidator
                  name="fee"
                  type="number"
                  label="Management Fee %"
                  value={InvestorStore.updateInvestorValues.managementFee}
                  onChange={this.handleEditRequests('managementFee')}
                  className={classes.alignInput}
                  validators={['isPositive', 'maxNumber:100']}
                  errorMessages={['Fee must be a positive number', 'must be a number between 0 and 100']}
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
              >
                Save
              </Button>
            </Grid>
          </ValidatorForm>
        </Modal>
      </Grid>
    );
  }
}

EditInvestor.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditInvestor);
