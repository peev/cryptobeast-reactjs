import React from 'react';
import { Grid } from 'material-ui';
import Paper from 'material-ui/Paper';

import RegularButton from '../../components/CustomButtons/Button';
import AddInvestorWrapped from '../../components/Modal/InvestorModals/AddInvestor';
import SelectInvestor from '../../components/Selectors/SelectInvestor';
import GenericTable from '../../components/GenericTable/GenericTable';
import EditInvestorWrapped from '../../components/Modal/InvestorModals/EditInvestor';

// import PropTypes from 'prop-types';
// test db
// const { ipcRenderer } = window.require('electron');
import './Investors.css';

const dropStyle = {
  width: '100%',
};

class Investors extends React.Component {
  state = {
    direction: 'row',
    // justify: 'flex-end',
    // alignItems: 'center',
  };

  render() {
    const { direction } = this.state;
    // const { alignItems, direction, justify } = this.state;

    return (
      <div>
        <Grid container >
          <div className="InvButtonsGroup">
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
        <Grid container className="InvGrid">
          <Paper className="InvPaper">
            <GenericTable
              tableHead={[
                'ID',
                'Name',
                'Date of Entry',
                'Transaction date',
                'Amount (USD)',
                'Share price',
                'New/Liquidated Shares',
              ]}
              tableData={[
                [
                  '1',
                  'SomeINvestor',
                  'A day',
                  'Transaction Dates',
                  '1$',
                  '1$',
                  'Test',
                ]
              ]}
            />
          </Paper>
        </Grid>
      </div>
    );
  }
}

export default Investors;
