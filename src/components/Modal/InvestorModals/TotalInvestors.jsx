import React from "react";
import PropTypes from "prop-types";
import { TextField } from "material-ui";
import { withStyles } from "material-ui/styles";

// import { Icon } from 'material-ui-icons';
import Modal from "material-ui/Modal";
import Typography from "material-ui/Typography";
import InvestorCard from "../../CustomElements/InvestorCard";
import Button from "../../CustomButtons/Button";
import GenericTable from "../../GenericTable/GenericTable";

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

class TotalInvestors extends React.Component {
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
    const { classes, headerText, labelText } = this.props;

    return (
      <div>
        <div>
          <Button onClick={this.handleOpen} style={{ padding: "0" }}>
            <InvestorCard headerText="10" labelText="Total Investors" />
          </Button>
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
              Investor Deposit
            </Typography>

            <GenericTable
              tableHead={[
                "ID",
                "Name",
                "Shares",
                "VALUE(USD)",
                "WEIGH.Entry Price",
                "Fee Potential",
                "Profit",
                "Edit"
              ]}
              tableData={[
                "1",
                "TestingName",
                "Today",
                "135",
                "1455.25",
                "$ 2.65",
                "523.48",
                "180%",
                " "
              ]}
            />

            <br />

            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

TotalInvestors.propTypes = {
  classes: PropTypes.object.isRequired
};

const TotalInvestorsWrapped = withStyles(styles)(TotalInvestors);

export default TotalInvestorsWrapped;
