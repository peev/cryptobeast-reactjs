import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { ItemGrid } from 'components';
import { Grid, Snackbar } from 'material-ui';
import Paper from 'material-ui/Paper';

// import RegularButton from '../../components/CustomButtons/Button';
// import SelectInvestor from '../../components/Selectors/SelectInvestor';
import TotalInvestorsWrapped from '../../components/Modal/InvestorModals/TotalInvestors';
import SharesInCirculationWrapped from '../../components/Modal/InvestorModals/SharesInCirculation';
import CurrentSharePriceWrapped from '../../components/Modal/InvestorModals/CurrentSharePrice';
import TotalUSDEquivWrapped from '../../components/Modal/InvestorModals/TotalUSDEquiv';

import AddInvestorWrapped from '../../components/Modal/InvestorModals/AddInvestor';
import InvestorDepositWrapped from '../../components/Modal/InvestorModals/InvestorDeposit';
import InvestorWithdrawWrapped from '../../components/Modal/InvestorModals/InvestorWithdraw';
import EditInvestorWrapped from '../../components/Modal/InvestorModals/EditInvestor';

import IndividualSummary from '../../components/Cards/Investors/IndividualSummary';
import GenericTable from '../../components/CustomTables/GenericTable';
import './Investors.css';

class Investors extends Component {
  state = {
    direction: 'row',
    open: false,
    // justify: 'flex-end',
    // alignItems: 'center',
  };

  render() {
    return (
      <div>
        <Grid container className="InvCardsGroup">
          <TotalInvestorsWrapped />
          <SharesInCirculationWrapped />
          <CurrentSharePriceWrapped />
          <TotalUSDEquivWrapped />
        </Grid>
        <Grid container className="InvButtonsGroup">
          <AddInvestorWrapped />
          <InvestorDepositWrapped />
          <InvestorWithdrawWrapped />
          <EditInvestorWrapped />
        </Grid>
        <Grid container className="InvGrid">
          <IndividualSummary />
        </Grid>
        <Grid container className="InvGrid">
          <Paper className="InvPaperTable">
            <GenericTable
              tableHead={[
                "ID",
                "Name",
                "Date of Entry",
                "Transaction date",
                "Amount (USD)",
                "Share price",
                "New/Liquidated Shares",
                "tatata",
                "tatatatata",
                "tatatata,"
              ]}
              tableData={[
                [
                  "1",
                  "SomeINvestor",
                  "A day",
                  "Transaction Dates",
                  "1$",
                  "1$",
                  "Test",
                  "test",
                  ""
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
