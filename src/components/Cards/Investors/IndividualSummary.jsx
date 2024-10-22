import React, { Component } from 'react';
import { withStyles, Grid } from 'material-ui';
import { inject, observer } from 'mobx-react';
import SelectInvestor from '../../Selectors/SelectInvestor';

const styles = () => ({
  container: {
    width: '100%',
    marginTop: '20px',
    padding: '0 20px',
  },
  containerItems: {
    paddingTop: '20px',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    borderBottom: '1px solid black',
    '&>p': {
      textTransform: 'uppercase',
      fontSize: '14px',
      margin: '0',
      padding: '0',
    },
    '&>span': {
      fontSize: '14px',
      fontWeight: '600',
    },
  },
  overrideGrid: {
    padding: '12px',
  },
  profitStyle: {
    color: '#60bb9b',
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
      <div>
        <Grid container>
          <Grid container className={classes.container}>
            <Grid item xs={6} sm={6} md={3}>
              <SelectInvestor />
            </Grid>
          </Grid>

          <Grid container className={classes.container}>
            <Grid item xs={12} sm={6} md={3}>
              <div className={classes.containerItems}>
                <p>Shares Held:</p>
                <span>{InvestorStore.individualSharesHeld}</span>
              </div>

              <div className={classes.containerItems}>
                <p>Weighted entry price:</p>
                <span>{InvestorStore.individualWeightedEntryPrice ? `$ ${InvestorStore.individualWeightedEntryPrice}` : ''}</span>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div className={classes.containerItems}>
                <p>USD Equivalent:</p>
                <span>{InvestorStore.individualUSDEquivalent}</span>
              </div>

              <div className={classes.containerItems}>
                <p>BTC Equivalent:</p>
                <span>{InvestorStore.individualBTCEquivalent}</span>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div className={classes.containerItems}>
                <p>Investment Period:</p>
                <span>{InvestorStore.individualInvestmentPeriod ? `${InvestorStore.individualInvestmentPeriod} DAYS` : ''}</span>
              </div>

              <div className={classes.containerItems}>
                <p>Profit:</p>
                <span className={classes.profitStyle}>{InvestorStore.individualProfit ? `${InvestorStore.individualProfit} %` : ''}</span>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div className={classes.containerItems}>
                <p>ETH Equivalent:</p>
                <span>{InvestorStore.individualETHEquivalent}</span>
              </div>

              <div className={classes.containerItems}>
                <p>Fee Potential:</p>
                <span>{InvestorStore.individualFeePotential ? `$ ${InvestorStore.individualFeePotential}` : ''}</span>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(IndividualSummary);
