// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, Grid } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import { inject, observer } from 'mobx-react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import SelectBaseCurrency from '../../Selectors/SelectBaseCurrency';
import Button from '../../CustomButtons/Button';
import NotificationSnackbar from '../../Modal/NotificationSnackbar';
import addInvestorModalStyle from '../../../variables/styles/addInvestorModalStyle';

const getModalStyle = () => {
  const top = 20;
  const left = 28;
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
    width: '95%',
    marginTop: '16px',
  },
  alignInputAfter: {
    width: '95%',
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
  width: {
    width: '95%',
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

  handleFounder = (name: string) => (event: SyntheticEvent) => {
    this.setState({ [name]: event.target.checked });
    this.props.InvestorStore.setIsFounder();
  };

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
    const {
      classes, InvestorStore, PortfolioStore, NotificationStore,
    } = this.props;
    const today = new Date().toISOString().substring(0, 10);

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
          <ValidatorForm
            // ref="form"
            onSubmit={this.handleSave}
            // onError={errors => console.log(errors)}
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
                <TextValidator
                  label="Full Name*"
                  onChange={this.handleRequests('fullName')}
                  name="name"
                  className={classes.width}
                  value={InvestorStore.newInvestorValues.fullName}
                  validators={['required']}
                  errorMessages={['this field is required']}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <TextValidator
                  label="Email*"
                  onChange={this.handleRequests('email')}
                  name="email"
                  value={InvestorStore.newInvestorValues.email}
                  validators={['required', 'isEmail']}
                  errorMessages={['this field is required', 'email is not valid']}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <TextValidator
                  label="Telephone"
                  onChange={this.handleRequests('telephone')}
                  name="telephone"
                  className={classes.width}
                  value={InvestorStore.newInvestorValues.telephone}
                  validators={['isNumber']}
                  errorMessages={['telephone is not valid']}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <TextValidator
                  onChange={this.handleRequests('dateOfEntry')}
                  type="date"
                  name="date"
                  value={InvestorStore.newInvestorValues.dateOfEntry || today}
                  validators={['required']}
                  errorMessages={['this field is required']}
                  className={classes.alignInput}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                  <SelectBaseCurrency />
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <TextValidator
                  label="Deposited Amount*"
                  onChange={this.handleRequests('depositedAmount')}
                  name="depositedAmount"
                  value={InvestorStore.newInvestorValues.depositedAmount}
                  validators={['required', 'isPositive']}
                  errorMessages={['this field is required', 'value must be a positive number']}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <TextValidator
                  disabled
                  name="USD"
                  label="Deposited USD Equiv."
                  className={classes.width}
                  value={Math.round(InvestorStore.convertedUsdEquiv * 100) / 100 || ''}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <TextValidator
                  type="number"
                  label="Management Fee %*"
                  onChange={this.handleRequests('managementFee')}
                  name="fee"
                  value={InvestorStore.newInvestorValues.managementFee || ''}
                  validators={['required', 'maxNumber:100']}
                  errorMessages={['this field is required', 'must be a number between 0 and 100']}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
              <TextValidator
                disabled
                name="share price"
                label="Share Price at Entry Date (USD)"
                className={classes.alignInputAfter}
                value={Math.round(PortfolioStore.currentPortfolioSharePrice * 100) / 100 || ''}
                style={{ width: '95%' }}
              />
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <TextValidator
                  disabled
                  name="shares"
                  type="number"
                  value={InvestorStore.purchasedShares || ''}
                  label="Purchased Shares"
                  className={classes.alignInputAfter}
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
                disabled={NotificationStore.getErrorsLength > 0 || InvestorStore.newInvestorValues.fullName === ''
                  || InvestorStore.newInvestorValues.email === '' || InvestorStore.newInvestorValues.dateOfEntry === ''
                  || InvestorStore.newInvestorValues.depositedAmount === '' || InvestorStore.newInvestorValues.managementFee === ''}
              >
                Save
              </Button>
            </Grid >
          </ValidatorForm>
        </Modal>

        <NotificationSnackbar />
      </Grid >
    );
  }
}

export default withStyles(styles, addInvestorModalStyle)(AddInvestor);
