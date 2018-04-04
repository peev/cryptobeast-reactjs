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
import buttonStyle from "../../../variables/styles/buttonStyle";
import InvestorPieChart from "../../HighCharts/InvestorPie";

const getModalStyle = () => {
  const top = 35;
  const left = 35;
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
    float: "right"
  }
});

class SharesInCirculation extends React.Component {
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
          <InvestorCardButton onClick={this.handleOpen}>
            <InvestorCard headerText="1180" labelText="Shares in Circulation" />
          </InvestorCardButton>
        </div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <div
            style={getModalStyle()}
            className={classes.paper}
            onSubmit={() => this.handleSave}
          >
            <Typography
              variant="title"
              id="modal-title"
              style={{ fontSize: "18px", fontWeight: "400" }}
            >
              Shareholders Breakdown
            </Typography>
            <div className={classes.flex}>
              <div style={{ display: "inline-block", marginRight: "10px" }}>
                <InvestorPieChart />
              </div>
            </div>

            <Button
              style={{ float: "right" }}
              onClick={this.handleClose}
              color="primary"
            >
              Close
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

SharesInCirculation.propTypes = {
  classes: PropTypes.object.isRequired
};

const SharesInCirculationWrapped = withStyles(styles, buttonStyle)(
  SharesInCirculation
);

export default SharesInCirculationWrapped;
