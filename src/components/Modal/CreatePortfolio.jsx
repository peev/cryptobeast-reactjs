import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Button from '../CustomButtons/Button';
import axios from 'axios';

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,

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
    // Add Axios Post to endpoint later on
    // console.log(this.name.input.value);
    console.log(this.name.value);
    const name = { name: this.name.value };

    axios.post('http://localhost:3200/portfolio/create', name)
      .then((result) => {
        console.log(result);
      })

    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button onClick={this.handleOpen} color="primary">Create</Button>
        <Modal
          style={{ minWidth: '0' }}
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
<<<<<<< HEAD:src/components/Modal/CreatePortfolio.jsx
              value=""

=======
              // onChange={this.handleInputValue}
              inputRef={el => this.name = el}
>>>>>>> faaa2d9bb674ec6ba2e4d65144b11818fd6a25ef:src/components/Modal/Modal.jsx
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
