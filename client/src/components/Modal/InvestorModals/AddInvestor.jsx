// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, Grid } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import SelectBaseCurrency from '../../Selectors/SelectBaseCurrency';
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
    width: '98%',
    marginTop: '16px',
  },
  alignInputAfter: {
    width: '98%',
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
  font: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
  },
  inputWrapper: {
    width: '200px',
    margin: '10px 20px 0',
  },
  inputWrapperSelectBaseCurrency: {
    width: '190px',
    margin: '10px 20px 0',
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
            <Grid container>
              <Grid item xs={6} sm={6} md={6}>
                <Typography
                  variant="title"
                  id="modal-title"
                  style={{ marginLeft: '20px', fontSize: '18px', fontWeight: '400', fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif' }}
                >
                  Add a new investor
                </Typography>
                {/* <div />
              </Grid>

              <Grid item xs={6} sm={6} md={6} className={classes.headerContainerRight}>
                <Typography
                  variant="subheading"
                  style={{ fontSize: '17px', fontWeight: '400', fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif' }}
                >
                  Founder
                </Typography>

                <Checkbox
                  color="primary"
                  className={classes.checkbox}
                  onChange={this.handleFounder('founder')}
                /> */}
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapper}>
                  <TextValidator
                    label="Full Name*"
                    onChange={this.handleRequests('fullName')}
                    name="name"
                    className={classes.width}
                    value={InvestorStore.newInvestorValues.fullName}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapper}>
                  <TextValidator
                    label="Email*"
                    onChange={this.handleRequests('email')}
                    name="email"
                    value={InvestorStore.newInvestorValues.email}
                    validators={['required', 'isEmail']}
                    errorMessages={['this field is required', 'email is not valid']}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapper}>
                  <TextValidator
                    label="Telephone"
                    onChange={this.handleRequests('telephone')}
                    name="telephone"
                    className={classes.width}
                    value={InvestorStore.newInvestorValues.telephone}
                    validators={['isNumber']}
                    errorMessages={['telephone is not valid']}
                  />
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapper}>
                  <TextValidator
                    onChange={this.handleRequests('dateOfEntry')}
                    type="date"
                    name="date"
                    value={InvestorStore.newInvestorValues.dateOfEntry || today}
                    validators={['required']}
                    errorMessages={['this field is required']}
                    className={classes.alignInput}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapperSelectBaseCurrency}>
                  <SelectBaseCurrency />
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapper}>
                  <TextValidator
                    label="Deposited Amount*"
                    onChange={this.handleRequests('depositedAmount')}
                    name="depositedAmount"
                    value={InvestorStore.newInvestorValues.depositedAmount}
                    validators={['required', 'isPositive']}
                    errorMessages={['this field is required', 'value must be a positive number']}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapper}>
                  <TextValidator
                    disabled
                    name="USD"
                    label="Deposited USD Equiv."
                    className={classes.width}
                    value={Math.round(InvestorStore.convertedUsdEquiv * 100) / 100 || ''}
                  />
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapper}>
                  <TextValidator
                    type="number"
                    label="Management Fee %*"
                    onChange={this.handleRequests('managementFee')}
                    name="fee"
                    value={InvestorStore.newInvestorValues.managementFee || ''}
                    validators={['required', 'maxNumber:100']}
                    errorMessages={['this field is required', 'must be a number between 0 and 100']}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapper}>
                  <TextValidator
                    disabled
                    name="share price"
                    label="Share Price at Entry Date (USD)"
                    className={classes.alignInputAfter}
                    value={Math.round(PortfolioStore.currentPortfolioSharePrice * 100) / 100 || ''}
                    style={{ width: '95%' }}
                  />
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} className={classes.containerDirection}>
                <div className={classes.inputWrapper}>
                  <TextValidator
                    disabled
                    name="shares"
                    type="number"
                    value={InvestorStore.purchasedShares || ''}
                    label="Purchased Shares"
                    className={classes.alignInputAfter}
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
                disabled={NotificationStore.getErrorsLength > 0}
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
