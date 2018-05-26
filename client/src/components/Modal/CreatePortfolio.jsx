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
    minWidth: '300px',
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
});

type Props = {
  classes: Object,
  InvestorStore: Object,
  NotificationStore: Object,
  PortfolioStore: Object,
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

  handleSave = () => {
    const hasErrors = this.props.PortfolioStore.handlePortfolioValidation();
    if (!hasErrors) {
      this.props.PortfolioStore.createPortfolio();
      this.handleClose();
    }
  };

  render() {
    const {
      classes, InvestorStore, PortfolioStore, NotificationStore,
    } = this.props;

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
              onChange={this.handleInputValue}
              value={PortfolioStore.newPortfolioName}
              validators={['required']}
              errorMessages={['this field is required']}
            />

            <SelectBaseCurrency
              label="Select currency"
              validators={['isPositive']}
            />

            <TextValidator
              label="Portfolio investment (optional)"
              style={{ width: '100%' }}
              onChange={this.handleRequests('depositedAmount')}
              name="depositedAmount"
              value={InvestorStore.newInvestorValues.depositedAmount}
              validators={['isPositive']}
              errorMessages={['this field is required', 'value must be a positive number']}
            />
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
              disabled={NotificationStore.getErrorsLength > 0 || PortfolioStore.newPortfolioName === ''}

              type="submit"
            >
              {' '}
              Save
            </Button>
          </ValidatorForm>
        </Modal>
      </div>
    );
  }
}

// We need an intermediary variable for handling the recursive nesting.
const CreatePortfolioWrapped = withStyles(styles)(CreatePortfolio);

export default CreatePortfolioWrapped;
