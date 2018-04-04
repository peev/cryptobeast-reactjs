import React from "react";
import PropTypes from "prop-types";
import { TextField } from "material-ui";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Modal from "material-ui/Modal";
import Button from "../CustomButtons/Button";
import IconButton from "../CustomButtons/IconButton";
import { Edit } from "material-ui-icons";
import { inject, observer } from "mobx-react";

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
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "400",
    textAlign: "center"
  }
});
@inject("PortfolioStore")
@observer
class UpdatePortfolioModal extends React.Component {
  constructor() {
    super();
    this.name = null
  }

  state = {
    open: false
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
      <div style={{ display: "inline-block" }}>
        <IconButton
          customClass="edit"
          onClick={this.handleOpen}
          color="primary"
        >
          <Edit style={{ width: ".8em", height: ".8em" }} />
        </IconButton>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography
              className={classes.modalTitle}
              variant="title"
              id="modal-title"
            >
              Edit current portfolio
            </Typography>

            <TextField
              style={{ width: "100%", marginBottom: "10px", marginTop: "10px" }}
              placeholder="Portfolio name"
              inputRef={el => (this.name = el)}
            />

            <br />

            {/* Cancel BUTTON */}
            <Button
              style={{
                display: "inline-flex",
                float: "left",
                marginRight: "50px"
              }}
              onClick={this.handleClose}
              color="primary"
            >
              {" "}
              Cancel
            </Button>

            {/* SAVE BUTTON */}
            <Button
              style={{ display: "inline-flex", float: "right" }}
              onClick={this.handleClose}
              color="primary"
            >
              {" "}
              Update
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

UpdatePortfolioModal.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
const UpdatePortfolioModalWrapped = withStyles(styles)(UpdatePortfolioModal);

export default UpdatePortfolioModalWrapped;
