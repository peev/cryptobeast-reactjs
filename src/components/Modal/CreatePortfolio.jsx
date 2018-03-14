import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';

import { inject } from 'mobx-react';

import Button from '../CustomButtons/Button';


function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,

  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    minWidth: '100px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4,

  },
});

@inject('PortfolioStore')
class CreatePortfolio extends React.Component {
  state = {
    open: false,
    name: '',
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSave = () => {
    const inputName = { name: this.name.value };

    const { PortfolioStore } = this.props;
    PortfolioStore.createPortfolio(inputName);

    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button onClick={this.handleOpen} color="primary">Create</Button>
        <Modal

          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <form style={getModalStyle()} className={classes.paper} onSubmit={() => this.handleSave}>
            <Typography
              variant="title"
              id="modal-title"
              style={{ fontSize: '18px', fontWeight: '400' }}
            >
              Create new Portfolio
            </Typography>

            <TextField
              placeholder="Portfolio name"
              // onChange={this.handleInputValue}
              inputRef={el => this.name = el}
            />

            <br />

            {/* Cancel BUTTON */}
            <Button
              style={{ display: 'inline-flex' }}
              onClick={this.handleClose}
              color="primary"

            > Cancel
            </Button>

            {/* SAVE BUTTON */}
            <Button
              style={{ display: 'inline-flex' }}
              onClick={this.handleSave}
              color="primary"
              type="submit"
            > Save
            </Button>

          </form>
        </Modal>
      </div>
    );
  }
}

CreatePortfolio.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const CreatePortfolioWrapped = withStyles(styles)(CreatePortfolio);

export default CreatePortfolioWrapped;
