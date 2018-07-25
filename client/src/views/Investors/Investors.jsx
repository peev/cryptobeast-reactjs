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
    '& button': {
      display: 'flex',
      width: '200px',
    },
  },
  herderBottomButton: {
    '& button': {
      display: 'flex',
      width: '200px',
      color: '#fff',
      backgroundColor: '#5e6779',
      '&:hover': {
        backgroundColor: '#666666',
      },
    },
  },
  upperPart: {
    marginBottom: '40px',
    display: 'flex',
    flexDirection: 'column',
  },
  infoBoxes: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
});


const Investors = ({ classes }: Object) => (
  <Grid container>
    <Grid container className={classes.upperPart}>
      <Grid className={classes.infoBoxes}>
        <Grid xs={3} sm={3} md={3} className={classes.herderTopButton}>
          <TotalInvestorsWrapped />
        </Grid>
        <Grid xs={3} sm={3} md={3} className={classes.herderTopButton}>
          <SharesInCirculationWrapped />
        </Grid>
        <Grid xs={3} sm={3} md={3} className={classes.herderTopButton}>
          <CurrentSharePrice />
        </Grid>
        <Grid xs={3} sm={3} md={3} className={classes.herderTopButton}>
          <TotalFeePotential />
        </Grid>
      </Grid>

      <Grid className={classes.buttons}>
        <Grid xs={3} sm={3} md={3} className={classes.herderBottomButton}>
          <AddInvestorWrapped />
        </Grid>
        <Grid xs={3} sm={3} md={3} className={classes.herderBottomButton}>
          <InvestorDepositWrapped />
        </Grid>
        <Grid xs={3} sm={3} md={3} className={classes.herderBottomButton}>
          <InvestorWithdrawWrapped />
        </Grid>
        <Grid xs={3} sm={3} md={3} className={classes.herderBottomButton}>
          <EditInvestorWrapped />
        </Grid>
      </Grid>
    </Grid>

    <Grid container>
      <Grid xs={12} sm={12} md={12}>
        <IndividualSummaryWrapper />
      </Grid>
    </Grid>
  </Grid>
);

export default withStyles(styles)(Investors);
