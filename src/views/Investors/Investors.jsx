import React from 'react';
import { Grid } from 'material-ui';
import Paper from 'material-ui/Paper';

import RegularButton from '../../components/CustomButtons/Button';
import AddInvestorWrapped from '../../components/Modal/InvestorModals/AddInvestor';
import InvestorDepositWrapped from '../../components/Modal/InvestorModals/InvestorDeposit';
import SelectInvestor from '../../components/Selectors/SelectInvestor';
import GenericTable from '../../components/GenericTable/GenericTable';
import EditInvestorWrapped from '../../components/Modal/InvestorModals/EditInvestor';
import InvestorWithdrawWrapped from '../../components/Modal/InvestorModals/InvestorWithdraw';
import './Investors.css';
import TotalInvestorsWrapped from '../../components/Modal/InvestorModals/TotalInvestors';
import SharesInCirculationWrapped from '../../components/Modal/InvestorModals/SharesInCirculation';
import CurrentSharePriceWrapped from '../../components/Modal/InvestorModals/CurrentSharePrice';
import TotalUSDEquivWrapped from '../../components/Modal/InvestorModals/TotalUSDEquiv';

const dropStyle = {
  width: '100%'
};

class Investors extends React.Component {
  state = {
    // direction: 'row'
    // justify: 'flex-end',
    // alignItems: 'center',
  };

  render() {
    // const { alignItems, direction, justify } = this.state;

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
          <Paper container className="InvPaper">
            <Grid >
              <h5>INDIVIDUAL SUMMARY</h5>
            </Grid>

            <Grid container>
              <Grid item xs={3}>
                <SelectInvestor style={dropStyle} />
              </Grid>
              <Grid item xs={3}>
                <p>Shares Held:</p>
                <p>Weighted entry price:</p>
                <p>Current Share Price:</p>
              </Grid>
              <Grid item xs={3}>
                <p>Shares Held:</p>
                <p>Weighted entry price:</p>
                <p>Current Share Price:</p>
              </Grid>
              <Grid item xs={3}>
                <p>Shares Held:</p>
                <p>Weighted entry price:</p>
                <p>Current Share Price:</p>
              </Grid>
            </Grid>
            <RegularButton color="primary">Export</RegularButton>
          </Paper>
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
