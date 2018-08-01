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
  const top = 25;
  const left = 35;
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
};

const styles = (theme: Object) => ({
  paper: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    width: '550px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '-1px 13px 57px 16px rgba(0,0,0,0.21)',
    padding: '30px 30px',
  },
  paperContainer: {
    margin: '0 -40px',
  },
  gridColumn: {
    width: '50%',
  },
  gridRow: {
    padding: '10px 40px 0 40px',
  },
  inputStyle: {
    width: '100%',
    textTransform: 'uppercase',
    '& input, & label': {
      paddingLeft: '10px',
      paddingRight: '10px',
      fontSize: '14px',
    },
    '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
      display: 'none',
    },
  },
  dateOfEntry: {
    width: '100%',
    marginTop: '16px',
    '& input': {
      paddingLeft: '10px',
      paddingRight: '6px',
    },
    '& input[type=date]::-webkit-inner-spin-button, & input[type=date]::-webkit-outer-spin-button': {
      display: 'none',
    },
    '& input[type=date]::-webkit-clear-button': {
      display: 'none',
    },
    '& input[type=date]::-webkit-calendar-picker-indicator': {
      color: '#999',
      width: '10px',
      fontSize: '11px',
      '&:hover': {
        backgroundColor: '#fff',
        color: '#555',
        cursor: 'pointer',
      },
    },
  },
  selectBaseCurrency: {
    width: '75%',
    textTransform: 'uppercase',
    fontSize: '13px',
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
        <Button onClick={this.handleOpen} color="primary" style={{ fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif' }}>
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
            <div className={classes.paperContainer}>
              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <Typography
                      variant="title"
                      id="modal-title"
                      style={{
                        fontSize: '18px',
                        fontWeight: '400',
                        // paddingLeft: '10px',
                        fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
                        textTransform: 'uppercase',
                      }}
                    >
                      Edit Investor
                    </Typography>
                  </div>
                </Grid>
              </Grid>

              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <SelectInvestor
                      value={InvestorStore.selectedInvestorId || ''}
                      handleChange={this.handleSelectInvestor}
                      style={{
                        marginTop: '12px',
                        border: 'none',
                        borderRadius: 0,
                        borderBottom: '1px solid #757575',
                        textTransform: 'uppercase',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextValidator
                      name="name"
                      // type="text"
                      label="Full name"
                      value={InvestorStore.updateInvestorValues.fullName}
                      onChange={this.handleEditRequests('fullName')}
                      className={classes.inputStyle}
                    // autoFocus
                    />
                  </div>
                </Grid>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextValidator
                      name="email"
                      // type="email"
                      label="Email Address"
                      value={InvestorStore.updateInvestorValues.email}
                      onChange={this.handleEditRequests('email')}
                      className={classes.inputStyle}
                      validators={['isEmail']}
                      errorMessages={['email is not valid']}
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextValidator
                      name="phone"
                      // type="number"
                      label="Telephone"
                      value={InvestorStore.updateInvestorValues.telephone}
                      onChange={this.handleEditRequests('telephone')}
                      className={classes.inputStyle}
                      validators={['isNumber']}
                      errorMessages={['telephone is not valid']}
                    />
                  </div>
                </Grid>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextValidator
                      name="fee"
                      // type="number"
                      label="Management Fee (%)"
                      value={InvestorStore.updateInvestorValues.managementFee}
                      onChange={this.handleEditRequests('managementFee')}
                      className={classes.inputStyle}
                      validators={['isPositive', 'maxNumber:100']}
                      errorMessages={['Fee must be a positive number', 'must be a number between 0 and 100']}
                    />
                  </div>
                </Grid>
              </Grid>

              <Grid container justify="flex-end">
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow} style={{ textAlign: 'right' }}>
                    <Button
                      color="primary"
                      onClick={this.handleClose}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      color="primary"
                      style={{ marginLeft: '25px' }}
                    >
                      Save
                    </Button>
                  </div>
                </Grid>
              </Grid >
            </div>
          </ValidatorForm>
        </Modal>
      </Grid >
    );
  }
}

export default withStyles(styles)(EditInvestor);
