// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, Grid } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Button from '../../CustomButtons/Button';
import SelectInvestor from '../../Selectors/SelectInvestor';


const getModalStyle = () => {
  const top = 20;
  const left = 35;
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
};

const styles = (theme: Object) => ({
  paper: {
    position: 'absolute',
    minWidth: '100px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '-1px 13px 57px 16px rgba(0,0,0,0.21)',
    padding: '40px',
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
  inputWrapper: {
    marginTop: '15px',
    width: '200px',
    margin: '0px 20px 0px 20px',
  },
});

type Props = {
  classes: Object,
  InvestorStore: Object,
};

type State = {
  open: boolean,
};

@inject('InvestorStore', 'PortfolioStore')
@observer
class EditInvestor extends React.Component<Props, State> {
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

  handleChange = (name: string) => (event: SyntheticEvent) => {
    this.setState({ [name]: event.target.checked });
  };

  handleEditRequests = (propertyType: string) => (event: SyntheticEvent) => {
    event.preventDefault();

    const inputValue = event.target.value;
    this.props.InvestorStore.setInvestorUpdateValues(propertyType, inputValue);
  }

  handleSelectInvestor = (value: *) => {
    this.props.InvestorStore.selectInvestor(value);
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
                <SelectInvestor
                  value={InvestorStore.selectedInvestorId || ''}
                  handleChange={this.handleSelectInvestor}
                  style={{
                  marginTop: '12px',
                  width: '95%',
                  border: 'none',
                  borderRadius: 0,
                  borderBottom: '1px solid #757575',
              }}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
              <div className={classes.inputWrapper}>
                <TextValidator
                  name="name"
                  type="text"
                  label="Full name"
                  value={InvestorStore.updateInvestorValues.fullName}
                  onChange={this.handleEditRequests('fullName')}
                  className={classes.alignInputAfter}
                  autoFocus
                />
              </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
              <div className={classes.inputWrapper}>
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
              </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
              <div className={classes.inputWrapper}>
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
              </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
              <div className={classes.inputWrapper}>
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
              </div>
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

export default withStyles(styles)(EditInvestor);
