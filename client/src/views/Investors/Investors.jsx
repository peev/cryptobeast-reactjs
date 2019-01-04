// @flow
import React from 'react';
import { withStyles, Grid } from '@material-ui/core';

import TotalInvestorsWrapped from '../../components/Modal/InvestorModals/TotalInvestors';
import SharesInCirculationWrapped from '../../components/Modal/InvestorModals/SharesInCirculation';
import CurrentSharePrice from '../../components/Modal/InvestorModals/CurrentSharePrice';
import TotalFeePotential from '../../components/Modal/InvestorModals/TotalFeePotential';
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
    </Grid>

    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <IndividualSummaryWrapper />
      </Grid>
    </Grid>
  </Grid>
);

export default withStyles(styles)(Investors);
