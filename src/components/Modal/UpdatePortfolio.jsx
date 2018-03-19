import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
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
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,

  },
});

class UpdatePortfolioModal extends React.Component {
  state = {
    open: false,
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  handleSave = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button onClick={this.handleOpen} color="primary">Edit</Button>

        <Modal
          style={{ minWidth: '0' }}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography
              variant="title"
              id="modal-title"
              style={{ fontSize: '18px', fontWeight: '400' }}
            >Edit current portfolio
            </Typography>

            <TextField
              placeholder="Portfolio name"
              value=""
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
              onClick={this.handleClose}
              color="primary"
            > Update
            </Button>
          </div>

        </Modal>

      </div>
    );
  }
}

UpdatePortfolioModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const UpdatePortfolioModalWrapped = withStyles(styles)(UpdatePortfolioModal);

export default UpdatePortfolioModalWrapped;
