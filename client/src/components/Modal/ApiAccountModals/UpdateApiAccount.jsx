// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { Edit } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { inject, observer } from 'mobx-react';

import Button from '../../CustomButtons/Button';
import IconButton from '../../CustomButtons/IconButton';
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
    minWidth: '200px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '-1px 13px 57px 16px rgba(0,0,0,0.21)',
    padding: '40px',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '200',
    textAlign: 'left',
  },
  inputWrapper: {
    marginTop: '15px',
    width: '300px',
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
  },
});

type Props = {
  classes: Object,
  apiId: string,
  PortfolioStore: Object,
  ApiAccountStore: Object,
  NotificationStore: Object,
};

type State = {
  open: boolean,
};

@inject('ApiAccountStore', 'PortfolioStore', 'NotificationStore')
@observer
class UpdateApiAccount extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      open: false,
    };
    this.name = null;
  }

  componentWillUnmount() {
    this.props.ApiAccountStore.resetApiAccount();
  }

  handleOpen = () => {
    this.setState({ open: true });
    this.props.ApiAccountStore.setApiAccountForEditing(this.props.apiId);
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.ApiAccountStore.resetApiAccount();
  };

  handleInputValue = (propertyType: string, event: SyntheticEvent) => {
    event.preventDefault();
    const newValue = event.target.value;
    this.props.ApiAccountStore.setApiAccountUpdateValues(propertyType, newValue);
  }

  handleSave = () => {
    const { ApiAccountStore, PortfolioStore } = this.props;
    const hasErrors = ApiAccountStore.handleCreateNewAccountErrors();

    if (PortfolioStore.selectedPortfolioId !== null && hasErrors) {
      ApiAccountStore.updateApiAccount(this.props.apiId);
      this.setState({ open: false });
    }
  };

  render() {
    const { classes, ApiAccountStore, NotificationStore } = this.props;

    return (
      <React.Fragment>
        <IconButton
          customClass="edit"
          className={classes.headerButton}
          onClick={this.handleOpen}
          color="primary"
        >
          <Edit style={{ width: '.8em', height: '.8em' }} />
        </IconButton>

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
            <div className={classes.isActiveCheckbox}>
              <Typography
                variant="title"
                id="modal-title"
                className={classes.modalTitle}
              >
                Edit {ApiAccountStore.values.exchange} API
              </Typography>
            </div>

            <div className={classes.container}>
              <TextValidator
                name="Api Key"
                label="Api Key*"
                className={classes.inputWrapper}
                value={ApiAccountStore.values.apiKey}
                onChange={(e: SyntheticEvent) => this.handleInputValue('apiKey', e)}
                validators={['required']}
                errorMessages={['this field is required']}
              />

              <TextValidator
                name="Api Secret"
                label="Api Secret*"
                className={classes.inputWrapper}
                value={ApiAccountStore.values.apiSecret}
                onChange={(e: SyntheticEvent) => this.handleInputValue('apiSecret', e)}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </div>

            <Button
              style={{ display: 'inline-flex', marginRight: '50px', float: 'left' }}
              onClick={this.handleClose}
              color="primary"
            >
              Cancel
            </Button>

            <Button
              style={{ display: 'inline-flex', float: 'right' }}
              color="primary"
              type="submit"
              disabled={NotificationStore.getErrorsLength > 0
                || ApiAccountStore.values.apiKey === ''
                || ApiAccountStore.values.apiSecret === ''}
            >
              Save
            </Button>
          </ValidatorForm>
        </Modal>
        <NotificationSnackbar />
      </React.Fragment>
    );
  }
}

// We need an intermediary variable for handling the recursive nesting.
const UpdateApiAccountWrapped = withStyles(styles)(UpdateApiAccount);

export default UpdateApiAccountWrapped;
