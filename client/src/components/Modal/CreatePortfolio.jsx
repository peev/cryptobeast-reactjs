// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import { Add } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';
import IconButton from '../CustomButtons/IconButton';


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
  PortfolioStore: Object,
};

type State = {
  open: boolean,
};

@inject('PortfolioStore')
@observer
class CreatePortfolio extends React.Component<Props, State> {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleInputValue = (event: SyntheticEvent) => {
    event.preventDefault();
    const inputValue = event.target.value;
    // console.log(inputValue);
    this.props.PortfolioStore.setNewPortfolioName(inputValue);
  }

  handleSave = () => {
    this.props.PortfolioStore.createPortfolio();
    this.props.PortfolioStore.resetPortfolio();

    this.setState({ open: false });
  };

  render() {
    const { classes, PortfolioStore } = this.props;

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
              Create new Portfolio
            </Typography>

            <TextValidator
              name="Portfolio Name"
              label="Portfolio name"
              style={{ width: '100%' }}
              onChange={this.handleInputValue}
              value={PortfolioStore.newPortfolioName}
              validators={['required']}
              errorMessages={['this field is required']}
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
