// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles } from 'material-ui';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import Modal from 'material-ui/Modal';
import { Add } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { inject, observer } from 'mobx-react';
import Button from '../../CustomButtons/Button';
import IconButton from '../../CustomButtons/IconButton';

import SelectExchange from '../../Selectors/Asset/SelectExchange';
import NotificationSnackbar from '../../Modal/NotificationSnackbar';


function getModalStyle() {
  const top = 30;
  const left = 41;
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}

const styles = (theme: Object) => ({
  paper: {
    position: 'absolute',
    width: '350px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '-1px 13px 57px 16px rgba(0,0,0,0.21)',
    padding: '30px',
  },
  headerButtonContainer: {
    float: 'right',
    marginTop: '-35px',
    marginRight: '40px',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '200',
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  isActiveCheckbox: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    '& span': {
      width: '16px',
      position: 'relative',
      top: '1px',
    },
    '& svg': {
      fontSize: '18px',
    },
  },
  inputStyle: {
    width: '100%',
    textTransform: 'uppercase',
    '& input, & label': {
      paddingLeft: '10px',
      paddingRight: '10px',
      fontSize: '14px',
    },
  },
  rowItem: {
    width: '100%',
    marginTop: '10px',
  },
  activeCheckbox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '20%',
  },
});

type Props = {
  classes: Object,
  AssetStore: Object,
  PortfolioStore: Object,
  ApiAccountStore: Object,
  NotificationStore: Object,
};

type State = {
  open: boolean,
};

@inject('ApiAccountStore', 'PortfolioStore', 'AssetStore', 'NotificationStore')
@observer
class AddApiAccount extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      open: false,
    };
    this.name = null;

    this.handleExchangeCreateAccount = this.handleExchangeCreateAccount.bind(this);
  }

  componentWillUnmount() {
    this.props.AssetStore.resetAsset();
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleInputValue = (propertyType: string, event: SyntheticEvent) => {
    event.preventDefault();
    const newValue = event.target.value;
    this.props.ApiAccountStore.setNewApiAccountValues(propertyType, newValue);
  }

  handleActive = () => {
    this.props.ApiAccountStore.setIsActive();
  }

  handleSave = () => {
    const { ApiAccountStore, PortfolioStore } = this.props;
    const hasErrors = ApiAccountStore.handleCreateNewAccountErrors();

    if (PortfolioStore.selectedPortfolioId !== null && hasErrors) {
      ApiAccountStore.addNewApiAccount();
      this.setState({ open: false });
    }
  };

  handleExchangeCreateAccount = (value: any) => {
    this.props.AssetStore.selectExchangeCreateAccount(value);
  }

  render() {
    const { classes, AssetStore, ApiAccountStore, NotificationStore } = this.props;
    return (
      <div className={classes.headerButtonContainer}>
        <IconButton
          className={classes.headerButton}
          onClick={this.handleOpen}
          color="primary"
        >
          <Add />
        </IconButton>
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
            <div className={classes.isActiveCheckbox}>
              <div>
                <Typography
                  variant="title"
                  id="modal-title"
                  className={classes.modalTitle}
                >
                  import from api
                </Typography>
              </div>
              <div className={classes.activeCheckbox}>
                active
                <Checkbox
                  onChange={() => this.handleActive('isActive')}
                  color="primary"
                  checked={ApiAccountStore.values.isActive}
                />
              </div>
            </div>
            <div className={classes.container}>
              <div className={classes.rowItem} style={{ width: '100%' }}>
                <SelectExchange
                  label="Select Exchange*"
                  value={AssetStore.selectedExchangeCreateAccount}
                  handleChange={this.handleExchangeCreateAccount}
                  validators={['required']}
                  errorMessages={['this field is required']}
                  style={{
                    border: 'none',
                    borderRadius: 0,
                    borderBottom: '1px solid #757575',
                    textTransform: 'uppercase',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div className={classes.rowItem}>
                <TextValidator
                  name="email"
                  label="Account*"
                  className={classes.inputStyle}
                  value={ApiAccountStore.values.account}
                  onChange={(e: SyntheticEvent) => this.handleInputValue('account', e)}
                  validators={['required', 'isEmail']}
                  errorMessages={['this field is required', 'email is not valid']}
                />
              </div>

              <div className={classes.rowItem}>
                <TextValidator
                  name="Api Key"
                  label="Api Key*"
                  className={classes.inputStyle}
                  value={ApiAccountStore.values.apiKey}
                  onChange={(e: SyntheticEvent) => this.handleInputValue('apiKey', e)}
                  validators={['required']}
                  errorMessages={['this field is required']}
                />
              </div>

              <div className={classes.rowItem}>
                <TextValidator
                  name="Api Secret"
                  label="Api Secret*"
                  className={classes.inputStyle}
                  value={ApiAccountStore.values.apiSecret}
                  onChange={(e: SyntheticEvent) => this.handleInputValue('apiSecret', e)}
                  validators={['required']}
                  errorMessages={['this field is required']}
                />
              </div>
            </div>
            <br />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Cancel BUTTON */}
              <Button
                onClick={this.handleClose}
                color="primary"
              >
                {' '}
                Cancel
              </Button>

              {/* SAVE BUTTON */}
              <Button
                // onClick={this.handleSave}
                color="primary"
                type="submit"
                disabled={NotificationStore.getErrorsLength > 0 || AssetStore.selectedExchangeCreateAccount === ''
                  || ApiAccountStore.values.apiKey === '' || ApiAccountStore.values.apiSecret === ''}
              >
                {' '}
                Save
              </Button>
            </div>
          </ValidatorForm>
        </Modal>
        <NotificationSnackbar />
      </div>
    );
  }
}

// We need an intermediary variable for handling the recursive nesting.
const AddApiAccountWrapped = withStyles(styles)(AddApiAccount);

export default AddApiAccountWrapped;
