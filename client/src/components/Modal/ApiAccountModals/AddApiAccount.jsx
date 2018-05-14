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
  const top = 45;
  const left = 41;
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}

const styles = (theme: Object) => ({
  paper: {
    position: 'absolute',
    minWidth: '200px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4,
  },
  headerButtonContainer: {
    float: 'right',
    marginTop: '-35px',
    marginRight: '40px',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '400',
    textAlign: 'center',
  },
  inputWrapper: {
    width: '200px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  isActiveCheckbox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

type Props = {
  classes: Object,
  // MarketStore: Object,
  AssetStore: Object,
  PortfolioStore: Object,
  ApiAccountStore: Object,
  NotificationStore: Object,
};

type State = {
  open: boolean,
};

@inject('ApiAccountStore', 'PortfolioStore', 'MarketStore', 'AssetStore', 'NotificationStore')
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

    if (PortfolioStore.selectedPortfolioId !== null) {
      ApiAccountStore.createNewAccount(PortfolioStore.selectedPortfolioId);
      this.props.NotificationStore.addMessage('successMessages', 'Successfully added API');
    }

    this.setState({ open: false });
  };

  handleExchangeCreateAccount = (value: any) => {
    this.props.AssetStore.selectExchangeCreateAccount(value);
  }

  render() {
    const { classes, AssetStore, ApiAccountStore } = this.props;
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
            <div>
              <Typography
                variant="title"
                id="modal-title"
                className={classes.modalTitle}
              >
                Import from API
              </Typography>

              <div className={classes.isActiveCheckbox}>
                Active
                <Checkbox
                  onChange={() => this.handleActive('isActive')}
                  color="primary"
                  checked={ApiAccountStore.values.isActive}
                />
              </div>
            </div>
            <div className={classes.container}>
              <div className={classes.inputWrapper}>
                <SelectExchange
                  label="Select Exchange"
                  value={AssetStore.selectedExchangeCreateAccount}
                  handleChange={this.handleExchangeCreateAccount}
                  validators={['required']}
                  errorMessages={['this field is required']}
                />
              </div>

              <TextValidator
                name="Api Key"
                label="Api Key"
                className={classes.inputWrapper}
                value={ApiAccountStore.values.apiKey}
                onChange={(e: SyntheticEvent) => this.handleInputValue('apiKey', e)}
                validators={['required']}
                errorMessages={['this field is required']}
              />

              <TextValidator
                name="Api Secret"
                label="Api Secret"
                className={classes.inputWrapper}
                value={ApiAccountStore.values.apiSecret}
                onChange={(e: SyntheticEvent) => this.handleInputValue('apiSecret', e)}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </div>
            <br />

            {/* Cancel BUTTON */}
            <Button
              style={{ display: 'inline-flex', marginRight: '50px', float: 'left' }}
              onClick={this.handleClose}
              color="primary"
            >
              {' '}
              Cancel
            </Button>

            {/* SAVE BUTTON */}
            <Button
              style={{ display: 'inline-flex', float: 'right' }}
              // onClick={this.handleSave}
              color="primary"
              type="submit"
            >
              {' '}
              Save
            </Button>
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
