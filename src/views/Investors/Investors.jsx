import React from "react";
import PropTypes from "prop-types";
import { withStyles, Grid, TextField } from "material-ui";
import Paper from "material-ui/Paper";
import RegularButton from "../../components/CustomButtons/Button";
// test db
import axios from "axios";
// const { ipcRenderer } = window.require('electron');
import AddInvestorWrapped from "../../components/Modal/InvestorModals/AddInvestor";
import SelectInvestor from "../../components/PortSelect/SelectInvestor";
import GenericTable from "../../components/GenericTable/GenericTable";

const styles = {
  root: {
    flexGrow: 1
  },
  paper: {
    maxHeight: 500,
    width: "100%",
    padding: 10
  },
  p: {
    borderBottom: "3px solid blue"
  }
};
const dropStyle = {
  width: 200
};

class Investors extends React.Component {
  state = {
    direction: "row",
    justify: "flex-end",
    alignItems: "center"
  };

  render() {
    const { alignItems, direction, direction2, justify } = this.state;

    return (
      <div>
        <Grid>
          <div style={{ display: "inline-flex", width: "100%" }}>
            <AddInvestorWrapped />
            <AddInvestorWrapped />

            <AddInvestorWrapped />
            <AddInvestorWrapped />
          </div>
        </Grid>
        <Grid container style={styles.root}>
          <Paper style={styles.paper}>
            <Grid container direction={direction}>
              <h4>INDIVIDUAL SUMMARY</h4>
            </Grid>

            <Grid container direction={direction2}>
              <Grid item xs={3} direction={direction2}>
                <SelectInvestor style={dropStyle} />
              </Grid>
              <Grid item xs={3} direction={direction2}>
                <p>Shares Held:</p>
                <p>Weighted entry price:</p>
                <p>Current Share Price:</p>
              </Grid>
              <Grid item xs={3} direction={direction2}>
                <p>Shares Held:</p>
                <p>Weighted entry price:</p>
                <p>Current Share Price:</p>
              </Grid>
              <Grid item xs={3} direction={direction2}>
                <p>Shares Held:</p>
                <p>Weighted entry price:</p>
                <p>Current Share Price:</p>
              </Grid>
            </Grid>
            <RegularButton color="primary">Export</RegularButton>
          </Paper>
        </Grid>
        <GenericTable
          style={{ backgroundColor: "#FFF" }}
          tableHead={[
            "ID",
            "Name",
            "Date of Entry",
            "Transaction date",
            "Amount (USD)",
            "Share price",
            "New/Liquidated Shares"
          ]}
          tableData={[
            [
              "1",
              "SomeINvestor",
              "A day",
              "Transaction Dates",
              "1$",
              "1$",
              "Test"
            ]
          ]}
        />
      </div>
    );
  }
}

Investors.propTypes = {
  classes: PropTypes.object.isRequired
};
export default Investors;
