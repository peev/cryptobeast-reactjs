import React from "react";
import PropTypes from "prop-types";
import { TextField } from "material-ui";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Modal from "material-ui/Modal";
import IconButton from "../CustomButtons/IconButton";
import { Add } from "material-ui-icons";
import { inject, observer } from "mobx-react";

import Button from "../CustomButtons/Button";

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
    position: "absolute",
    minWidth: "300px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4
  },
  headerButtonContainer: {
    float: "right",
    marginTop: "-35px",
    marginRight: "40px"
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "400",
    textAlign: "center"
  },
});

@inject("PortfolioStore")
@observer
class CreatePortfolio extends React.Component {
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

  handleSave = () => {
    const inputName = { name: this.name.value };

    this.props.PortfolioStore.createPortfolio(inputName);

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
            <Typography
              variant="title"
              id="modal-title"
              className={classes.modalTitle}
            >
              Create new Portfolio
            </Typography>

            <TextField
              placeholder="Portfolio name"
              style={{ width: "100%" }}
              // onChange={this.handleInputValue}
              inputRef={el => (this.name = el)}
            />

            <br />

            {/* Cancel BUTTON */}
            <Button
              style={{ display: "inline-flex", marginRight: '50px', float:'left' }}
              onClick={this.handleClose}
              color="primary"
            >
              {" "}
              Cancel
            </Button>

            {/* SAVE BUTTON */}
            <Button
              style={{ display: "inline-flex", float:'right' }}
              onClick={this.handleSave}
              color="primary"
              type="submit"
            >
              {" "}
              Save
            </Button>
          </form>
        </Modal>
      </div>
    );
  }
}

CreatePortfolio.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
const CreatePortfolioWrapped = withStyles(styles)(CreatePortfolio);

export default CreatePortfolioWrapped;
