import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, TextField } from 'material-ui';
import Paper from 'material-ui/Paper';
import RegularButton from '../../components/CustomButtons/Button';
// test db
import axios from 'axios';
// const { ipcRenderer } = window.require('electron');
<<<<<<< HEAD
import AddInvestorWrapped from '../../components/Modal/InvestorModals/AddInvestor';
import SelectInvestor from '../../components/PortSelect/SelectInvestor';
import GenericTable from '../../components/GenericTable/GenericTable';

const styles = {
  root: {
    flexGrow: 1
  },
  paper: {
    maxHeight: 500,
    width: '100%',
    padding: 10
  },
  p: {
    borderBottom: '3px solid blue'
  }
};
=======
import AddInvestorWrapped from "../../components/Modal/InvestorModals/AddInvestor";
import SelectInvestor from "../../components/Selectors/SelectInvestor";
import GenericTable from "../../components/GenericTable/GenericTable";
import EditInvestorWrapped from "../../components/Modal/InvestorModals/EditInvestor";

import classes from "./Investors.css";

>>>>>>> b05afb2d716368518869ac810369674ee1b556f0
const dropStyle = {
  width: "100%"
};

class Investors extends React.Component {
  state = {
    direction: 'row',
    justify: 'flex-end',
    alignItems: 'center'
  };

  render() {
    const { alignItems, direction, justify } = this.state;

    return (
      <div>
<<<<<<< HEAD
        <Grid>
          <div style={{ display: 'inline-flex', width: '100%' }}>
            <AddInvestorWrapped />
=======
        <Grid container >
          <div className="InvButtonsGroup">
>>>>>>> b05afb2d716368518869ac810369674ee1b556f0
            <AddInvestorWrapped />

            <AddInvestorWrapped />
            <AddInvestorWrapped />
            <EditInvestorWrapped />
          </div>
        </Grid>
        <Grid container className="InvGrid">
          <Paper className="InvPaper">
            <Grid container direction={direction}>
              <h4>INDIVIDUAL SUMMARY</h4>
            </Grid>

            <Grid container >
              <Grid item xs={3} >
                <SelectInvestor style={dropStyle} />
              </Grid>
              <Grid item xs={3} >
                <p>Shares Held:</p>
                <p>Weighted entry price:</p>
                <p>Current Share Price:</p>
              </Grid>
              <Grid item xs={3} >
                <p>Shares Held:</p>
                <p>Weighted entry price:</p>
                <p>Current Share Price:</p>
              </Grid>
              <Grid item xs={3} >
                <p>Shares Held:</p>
                <p>Weighted entry price:</p>
                <p>Current Share Price:</p>
              </Grid>
            </Grid>
            <RegularButton color="primary">Export</RegularButton>
          </Paper>
        </Grid>
<<<<<<< HEAD
        <GenericTable
          style={{ backgroundColor: '#FFF' }}
          tableHead={[
            'ID',
            'Name',
            'Date of Entry',
            'Transaction date',
            'Amount (USD)',
            'Share price',
            'New/Liquidated Shares'
          ]}
          tableData={[
            [
              '1',
              'SomeINvestor',
              'A day',
              'Transaction Dates',
              '1$',
              '1$',
              'Test'
            ]
          ]}
        />
=======
        <Grid container className="InvGrid">
          <Paper className="InvPaper">
            <GenericTable
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
          </Paper>
        </Grid>
>>>>>>> b05afb2d716368518869ac810369674ee1b556f0
      </div>
    );
  }
}

Investors.propTypes = {
  classes: PropTypes.object.isRequired
};
export default Investors;
