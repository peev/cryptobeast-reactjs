import React, { Component } from 'react';
import { withStyles, Grid } from 'material-ui';

import TotalInvestorsWrapped from '../../components/Modal/InvestorModals/TotalInvestors';
import SharesInCirculationWrapped from '../../components/Modal/InvestorModals/SharesInCirculation';
import CurrentSharePriceWrapped from '../../components/Modal/InvestorModals/CurrentSharePrice';
import TotalUSDEquivWrapped from '../../components/Modal/InvestorModals/TotalUSDEquiv';

import AddInvestorWrapped from '../../components/Modal/InvestorModals/AddInvestor';
import InvestorDepositWrapped from '../../components/Modal/InvestorModals/InvestorDeposit';
import InvestorWithdrawWrapped from '../../components/Modal/InvestorModals/InvestorWithdraw';
import EditInvestorWrapped from '../../components/Modal/InvestorModals/EditInvestor';

import IndividualSummaryWrapper from '../../components/Cards/Investors/IndividualSummaryWrapper';


const styles = () => ({
  herderTopButton: {
    '& button': {
      display: 'flex',
      width: '200px',
      margin: '10px auto',
    },
  },
  herderBottomButton: {
    '& button': {
      display: 'flex',
      width: '200px',
      margin: '10px auto',
      color: '#fff',
      backgroundColor: '#5e6779',
      '&:hover': {
        backgroundColor: '#666666',
      },
    },
  },
  headerPosition1: {
    marginTop: '15px',
  },
  headerPosition2: {
    marginTop: '0',
  },
  itemsCardPosition: {
    marginTop: '30px',
  },
});


class Investors extends Component {
  state = {};

  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        <Grid container spacing={40} className={classes.headerPosition1}>
          <Grid item xs={3} sm={3} md={3} className={classes.herderTopButton}>
            <TotalInvestorsWrapped />
          </Grid>
          <Grid item xs={3} sm={3} md={3} className={classes.herderTopButton}>
            <SharesInCirculationWrapped />
          </Grid>
          <Grid item xs={3} sm={3} md={3} className={classes.herderTopButton}>
            <CurrentSharePriceWrapped />
          </Grid>
          <Grid item xs={3} sm={3} md={3} className={classes.herderTopButton}>
            <TotalUSDEquivWrapped />
          </Grid>
        </Grid>

        <Grid container spacing={40} className={classes.headerPosition2}>
          <Grid item xs={3} sm={3} md={3} className={classes.herderBottomButton}>
            <AddInvestorWrapped />
          </Grid>
          <Grid item xs={3} sm={3} md={3} className={classes.herderBottomButton}>
            <InvestorDepositWrapped />
          </Grid>
          <Grid item xs={3} sm={3} md={3} className={classes.herderBottomButton}>
            <InvestorWithdrawWrapped />
          </Grid>
          <Grid item xs={3} sm={3} md={3} className={classes.herderBottomButton}>
            <EditInvestorWrapped />
          </Grid>
        </Grid>

        <Grid container className={classes.itemsCardPosition}>
          <Grid item xs={12} sm={12} md={12}>
            <IndividualSummaryWrapper />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Investors);
