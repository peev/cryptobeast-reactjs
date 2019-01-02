// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, Grid } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { inject, observer } from 'mobx-react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Button from '../../CustomButtons/Button';
import NotificationSnackbar from '../../Modal/NotificationSnackbar';
import addInvestorModalStyle from '../../../variables/styles/addInvestorModalStyle';

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
    padding: '30px',
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
      paddingRight: '12px',
    },
    '& input[type=date]::-webkit-inner-spin-button, & input[type=date]::-webkit-outer-spin-button': {
      display: 'none',
    },
    '& input[type=date]::-webkit-clear-button': {
      display: 'none',
    },
    '& input[type=date]::-webkit-calendar-picker-indicator': {
      position: 'relative',
      fontSize: '12px',
      top: '-5px',
      padding: '1px',
      color: 'transparent',
      border: 'solid #999',
      borderWidth: '0 1px 1px 0',
      transform: 'rotate(45deg)',
      '&:hover': {
        backgroundColor: '#fff',
        cursor: 'pointer',
      },
    },
  },
  selectBaseCurrency: {
    width: '75%',
    textTransform: 'uppercase',
    fontSize: '13px',
  },
  font: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
  },
});

type Props = {
  classes: Object,
  InvestorStore: Object,
  NotificationStore: Object,
  MarketStore: Object,
  PortfolioStore: Object,
};

type State = {
  open: boolean,
};

@inject('InvestorStore', 'PortfolioStore', 'MarketStore', 'NotificationStore')
@observer
class AddInvestor extends React.Component<Props, State> {
  state = {
    open: false,
  };

  componentWillMount() {
    this.props.InvestorStore.handleIsPortfolioSelected();
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.InvestorStore.reset();
    this.props.MarketStore.resetMarket();

    this.setState({ open: false });
  };

  handleRequests = (propertyType: string) => (event: SyntheticEvent) => {
    event.preventDefault();
    const { InvestorStore } = this.props;
    const inputValue = event.target.value;
    InvestorStore.setNewInvestorValues(propertyType, inputValue);
  }

  handleSave = () => {
    const { PortfolioStore, InvestorStore } = this.props;

    // FIXME: dont spam Save Button
    const hasErrors = InvestorStore.handleAddInvestorErrors();

    if (hasErrors) {
      InvestorStore.createNewInvestor(PortfolioStore.selectedPortfolioId);
      this.handleClose();
    }
  };

  render() {
    const { classes, InvestorStore, NotificationStore } = this.props;

    return (
      <Grid container>
        <Button onClick={this.handleOpen} color="primary" style={{ fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif' }} >
          Add new investor
        </Button>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <ValidatorForm
            // ref="form"
            onSubmit={this.handleSave}
            // onError={errors => console.log(errors)}
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
                      Add a new investor
                    </Typography>
                  </div>
                </Grid>
                {/* <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    founder
                    <input type="checkbox" />
                  </div>
                </Grid> */}
              </Grid>

              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextValidator
                      label="Full Name*"
                      onChange={this.handleRequests('name')}
                      name="name"
                      className={classes.inputStyle}
                      value={InvestorStore.newInvestorValues.name}
                      validators={['required']}
                      errorMessages={['this field is required']}
                    />
                  </div>
                </Grid>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextValidator
                      label="Email address*"
                      onChange={this.handleRequests('email')}
                      name="email"
                      className={classes.inputStyle}
                      value={InvestorStore.newInvestorValues.email}
                      validators={['required', 'isEmail']}
                      errorMessages={['this field is required', 'email is not valid']}
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextValidator
                      label="Telephone"
                      onChange={this.handleRequests('phone')}
                      name="telephone"
                      className={classes.inputStyle}
                      value={InvestorStore.newInvestorValues.phone}
                      validators={['required', 'isNumber']}
                      errorMessages={['this field is required', 'telephone is not valid']}
                    />
                  </div>
                </Grid>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextValidator
                      label="Management Fee (%)"
                      onChange={this.handleRequests('fee')}
                      name="fee"
                      // type="number"
                      className={classes.inputStyle}
                      value={InvestorStore.newInvestorValues.fee || ''}
                      validators={['required', 'isPositive', 'maxNumber:100']}
                      errorMessages={['this field is required', 'value must be a positive number', 'must be a number between 0 and 100']}
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
                      disabled={NotificationStore.getErrorsLength > 0}
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

        <NotificationSnackbar />
      </Grid >
    );
  }
}

export default withStyles(styles, addInvestorModalStyle)(AddInvestor);
