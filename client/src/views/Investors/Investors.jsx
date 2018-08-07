// @flow
import React from 'react';
import { withStyles, Grid } from 'material-ui';

import TotalInvestorsWrapped from '../../components/Modal/InvestorModals/TotalInvestors';
import SharesInCirculationWrapped from '../../components/Modal/InvestorModals/SharesInCirculation';
import CurrentSharePrice from '../../components/Modal/InvestorModals/CurrentSharePrice';
import TotalFeePotential from '../../components/Modal/InvestorModals/TotalFeePotential';

import AddInvestorWrapped from '../../components/Modal/InvestorModals/AddInvestor';
import InvestorDepositWrapped from '../../components/Modal/InvestorModals/InvestorDeposit';
import InvestorWithdrawWrapped from '../../components/Modal/InvestorModals/InvestorWithdraw';
import EditInvestorWrapped from '../../components/Modal/InvestorModals/EditInvestor';

import IndividualSummaryWrapper from '../../components/Cards/Investors/IndividualSummaryWrapper';


const styles = () => ({
  herderTopButton: {
    padding: '25px 50px',
    '& button': {
      display: 'flex',
      width: '100%',
      margin: '0',
    },
  },
  herderBottomButton: {
    padding: '25px 50px',
    '& button': {
      display: 'flex',
      width: '100%',
      color: '#fff',
      backgroundColor: '#5e6779',
      margin: '0',
      '&:hover': {
        backgroundColor: '#666666',
      },
    },
  },
  upperPart: {
    justifyContent: 'center',
    margin: '-25px 0 25px 0',
  },
  upperPartSingleRow: {
    justifyContent: 'center',
  },
});


const Investors = ({ classes }: Object) => (
  <Grid container>
    <Grid container className={classes.upperPart}>
      <Grid container className={classes.upperPartSingleRow}>
        <Grid item xs={12} sm={9} md={5} lg={3} className={classes.herderTopButton}>
          <TotalInvestorsWrapped />
        </Grid>
        <Grid item xs={12} sm={9} md={5} lg={3} className={classes.herderTopButton}>
          <SharesInCirculationWrapped />
        </Grid>
        <Grid item xs={12} sm={9} md={5} lg={3} className={classes.herderTopButton}>
          <CurrentSharePrice />
        </Grid>
        <Grid item xs={12} sm={9} md={5} lg={3} className={classes.herderTopButton}>
          <TotalFeePotential />
        </Grid>
      </Grid>

      <Grid container className={classes.upperPartSingleRow}>
        <Grid item xs={12} sm={9} md={5} lg={3} className={classes.herderBottomButton}>
          <AddInvestorWrapped />
        </Grid>
        <Grid item xs={12} sm={9} md={5} lg={3} className={classes.herderBottomButton}>
          <InvestorDepositWrapped />
        </Grid>
        <Grid item xs={12} sm={9} md={5} lg={3} className={classes.herderBottomButton}>
          <InvestorWithdrawWrapped />
        </Grid>
        <Grid item xs={12} sm={9} md={5} lg={3} className={classes.herderBottomButton}>
          <EditInvestorWrapped />
        </Grid>
      </Grid>
    </Grid>

    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <IndividualSummaryWrapper />
      </Grid>
    </Grid>
  </Grid>
);

export default withStyles(styles)(Investors);
