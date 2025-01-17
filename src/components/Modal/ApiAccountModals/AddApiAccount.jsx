import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import Modal from 'material-ui/Modal';
import { Add } from 'material-ui-icons';
import { inject, observer } from 'mobx-react';
import Button from '../../CustomButtons/Button';
import IconButton from '../../CustomButtons/IconButton';

import SelectApi from '../../Selectors/SelectApi';


function getModalStyle() {
  const top = 45;
  const left = 41;
  return {
    top: `${top}%`,
    left: `${left}%`
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    minWidth: '200px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4
  },
  headerButtonContainer: {
    float: 'right',
    marginTop: '-35px',
    marginRight: '40px'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '400',
    textAlign: 'center'
  },
  inputWrapper: {
    width: '200px'
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
  }
});

@inject('ApiAccountStore', 'PortfolioStore')
@observer
class AddApiAccount extends React.Component {
  constructor() {
    super();
    this.name = null;
  }

  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleInputValue = (propertyType, event) => {
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
    }

    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

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
          <form
            style={getModalStyle()}
            className={classes.paper}
            onSubmit={() => this.handleSave}
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
                  checked={this.props.ApiAccountStore.values.isActive}
                />
              </div>
            </div>
            <div className={classes.container}>
              {/* <TextField
                placeholder="Api Service Name"
                className={classes.inputWrapper}
                onChange={(e) => this.handleInputValue('apiServiceName', e)}
              // inputRef={el => (this.apiServiceName = el)}
              /> */}

              <SelectApi />

              <TextField
                placeholder="Api Key"
                className={classes.inputWrapper}
                // onChange={this.handleInputValue}
                onChange={(e) => this.handleInputValue('apiKey', e)}
              // inputRef={el => (this.apiKey = el)}
              />

              <TextField
                placeholder="Api Secret"
                className={classes.inputWrapper}
                // onChange={this.handleInputValue}
                onChange={(e) => this.handleInputValue('apiSecret', e)}
              // inputRef={el => (this.apiSecret = el)}
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
              onClick={this.handleSave}
              color="primary"
              type="submit"
            >
              {' '}
              Save
            </Button>
          </form>
        </Modal>
      </div>
    );
  }
}

AddApiAccount.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
const AddApiAccountWrapped = withStyles(styles)(AddApiAccount);

export default AddApiAccountWrapped;
