import React from "react";
import PropTypes from "prop-types";
import { TextField } from "material-ui";
import { withStyles } from "material-ui/styles";

// import { Icon } from 'material-ui-icons';
import Modal from "material-ui/Modal";
import Typography from "material-ui/Typography";
import InvestorCard from "../../CustomElements/InvestorCard";
import Button from "../../CustomButtons/Button";

import InvestorCardButton from "../../CustomButtons/InvestorCardButton";


const getModalStyle = () => {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`
  };
};

const styles = theme => ({
  paper: {
    position: "absolute",
    minWidth: "100px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4
  },
  button: {
    float: "right",
    display: "inline-flex"
  }
});

class TotalUSDEquiv extends React.Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div>
          <InvestorCardButton onClick={this.handleOpen} >
            <InvestorCard
              headerText="$3.1k"
              labelText="Total USD Equivalent"
            />
          </InvestorCardButton>
        </div>
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
              style={{ fontSize: "18px", fontWeight: "400" }}
            >
              Investor Deposit
            </Typography>
            <div className={classes.flex}>
              <div style={{ display: "inline-block", marginRight: "10px" }}>
                <TextField
                  placeholder="Amount"
                  // inputRef={el =>this.name = el}
                />
                <br />
                <TextField
                  placeholder="Share Price at Entry Date"
                  // inputRef={el =>this.name = el}
                />
              </div>
              <div style={{ display: "inline-block" }}>
                <TextField
                  placeholder="Transaction Date "
                  // inputRef={el =>this.name = el}
                />
                <br />
                <TextField placeholder="Purchased Shares" />
              </div>
            </div>

            <br />

            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSave} color="primary" type="submit">
              {" "}
              Save
            </Button>
          </form>
        </Modal>
      </div>
    );
  }
}

TotalUSDEquiv.propTypes = {
  classes: PropTypes.object.isRequired
};

const TotalUSDEquivWrapped = withStyles(styles)(TotalUSDEquiv);

export default TotalUSDEquivWrapped;
