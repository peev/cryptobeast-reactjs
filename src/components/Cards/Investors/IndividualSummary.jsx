import React, { Component } from 'react';
import { withStyles, Grid, Input } from 'material-ui';
import Paper from 'material-ui/Paper';
import { inject, observer } from 'mobx-react';
import SelectInvestor from '../../Selectors/SelectInvestor';
import RegularButton from '../../CustomButtons/Button';


const styles = () => ({
  container: {
    width: '100%',
    margin: '40px 40px 0',
    padding: '20px 25px',
  },
});
@inject('InvestorStore')
@observer
class IndividualSummary extends Component {
  state = {
    direction: 'row',
  };

  render() {
    const { classes, InvestorStore } = this.props;

    return (
      <Paper container className="InvPaper">
        <Grid >
          <h5>INDIVIDUAL SUMMARY</h5>
        </Grid>

        <Grid container>
          <Grid container>
            <Grid item xs={3}>
              <SelectInvestor style={classes.container} />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={3}>
              <p>Shares Held: {InvestorStore.individualSharesHeld}</p>
              <p>Weighted entry price: ${InvestorStore.individualWeightedEntryPrice}</p>
            </Grid>

            <Grid item xs={3}>
              <p>USD Equivalent: {InvestorStore.individualUSDEquivalent}</p>
              <p>BTC Equivalent: {InvestorStore.individualBTCEquivalent}</p>
            </Grid>

            <Grid item xs={3}>
              <div>
                <p>Investment Period:</p>
                <span>{InvestorStore.individualInvestmentPeriod} days</span>
              </div>
              <p>Profit:{InvestorStore.individualProfit}</p>
            </Grid>

            <Grid item xs={3}>
              <p>ETH Equivalent: {InvestorStore.individualETHEquivalent}</p>
              <p>Fee Potential: ${InvestorStore.individualFeePotential}</p>
            </Grid>
          </Grid>
        </Grid>
        <RegularButton color="primary">Export</RegularButton>
      </Paper>
    );
  }
}

export default withStyles(styles)(IndividualSummary);
