// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import { Add } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';
import IconButton from '../CustomButtons/IconButton';

import SelectBaseCurrency from '../Selectors/SelectBaseCurrency';
import Button from '../CustomButtons/Button';

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
    minWidth: '300px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '-1px 13px 57px 16px rgba(0,0,0,0.21)',
    padding: theme.spacing.unit * 4,
  },
  buttonSettings: {
    float: 'right',
    marginTop: '-35px',
    marginRight: '40px',
  },
  buttonStartScreen: {
    marginTop: '51px',
    padding: '12px 41px',
    backgroundColor: '#5E6779',
    color: 'white',
    border: 'none',
    textTransform: 'uppercase',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '400',
    textAlign: 'center',
  },
  inputWrapper: {
    marginTop: '15px',
    width: '300px',
  },
});

type Props = {
  classes: Object,
  InvestorStore: Object,
  NotificationStore: Object,
  PortfolioStore: Object,
  place: string,
};

type State = {
  open: boolean,
};

@inject('InvestorStore', 'PortfolioStore', 'NotificationStore')
@observer
class CreatePortfolio extends React.Component<Props, State> {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.PortfolioStore.resetPortfolio();
    this.props.InvestorStore.reset();
    this.setState({ open: false });
  };

  handleInputValue = (event: SyntheticEvent) => {
    event.preventDefault();
    const inputValue = event.target.value;
    this.props.PortfolioStore.setNewPortfolioName(inputValue);
  }

  handleRequests = (propertyType: string) => (event: SyntheticEvent) => {
    event.preventDefault();
    const { InvestorStore } = this.props;
    const inputValue = event.target.value;
    InvestorStore.setNewInvestorValues(propertyType, inputValue);
  }

  handleSave = (placeCalled: string) => {
    const hasErrors = this.props.PortfolioStore.handlePortfolioValidation();
    if (!hasErrors) {
      this.props.PortfolioStore.createPortfolio(placeCalled);
      this.setState({ open: false });
    }
  };

  render() {
    const {
      classes, InvestorStore, PortfolioStore, NotificationStore, place,
    } = this.props;
    let createButton = null;

    if (place === 'startScreen') {
      createButton = (
        <button
          className={classes.buttonStartScreen}
          onClick={this.handleOpen}
        >
          create
        </button>
      );
    } else if (place === 'settings') {
      createButton = (
        <div className={classes.buttonSettings}>
          <IconButton
            onClick={this.handleOpen}
            color="primary"
          >
            <Add />
          </IconButton>
        </div>
      );
    }

    return (
      <React.Fragment>
        {createButton}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <ValidatorForm
            onSubmit={() => this.handleSave(place)}
            style={getModalStyle()}
            className={classes.paper}
          >
            <Typography
              variant="title"
              id="modal-title"
              className={classes.modalTitle}
            >
              CREATE PORTFOLIO
            </Typography>

            <TextValidator
              name="Portfolio Name"
              label="Portfolio name*"
              style={{ width: '100%' }}
              className={classes.inputWrapper}
              onChange={this.handleInputValue}
              value={PortfolioStore.newPortfolioName}
              validators={['required']}
              errorMessages={['this field is required']}
            />
            <div className={classes.inputWrapper}>
              <SelectBaseCurrency
                className={classes.inputWrapper}
                label="Select currency"
                validators={['isPositive']}
              />
            </div>
            <TextValidator
              label="Portfolio investment (optional)"
              style={{ width: '100%' }}
              onChange={this.handleRequests('depositedAmount')}
              name="depositedAmount"
              value={InvestorStore.newInvestorValues.depositedAmount}
              className={classes.inputWrapper}
              validators={['isPositive']}
              errorMessages={['value must be a positive number']}
            />
            <br />

            {/* Cancel BUTTON */}
            <div className={classes.inputWrapper} >
              <Button
                style={{ display: 'inline-flex', marginRight: '50px', float: 'left' }}
                onClick={this.handleClose}
                color="primary"
              >
                Cancel
              </Button>

              {/* SAVE BUTTON */}
              <Button
                style={{ display: 'inline-flex', float: 'right' }}
                color="primary"
                disabled={NotificationStore.getErrorsLength > 0 || PortfolioStore.newPortfolioName === ''}
                type="submit"
              >
                Save
              </Button>
            </div>
          </ValidatorForm>
        </Modal>
      </React.Fragment>
    );
  }
}

// We need an intermediary variable for handling the recursive nesting.
const CreatePortfolioWrapped = withStyles(styles)(CreatePortfolio);

export default CreatePortfolioWrapped;
