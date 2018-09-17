// @flow
import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import Button from '../../CustomButtons/Button';
import SelectBenchmark from '../../Selectors/Analytics/SelectBenchmark';
import SelectPeriod from '../../Selectors/Analytics/SelectPeriod';
import TotalAssetsValue from '../../HighCharts/TotalAssetsValue';
import PerformanceAssets from '../../HighCharts/PerformanceAssets';
import SummaryPerformanceCard from '../../Cards/Analytics/SummaryPerformanceCard';

const styles = () => ({
  marginTop: {
    marginTop: '40px',
  },
  marginRight: {
    marginRight: '75px',
  },
  header: {
    color: 'red',
    margin: '20px 0',
  },
});

type Props = {
  classes: Object,
};

const Performance = inject('Analytics')(observer(({ ...props }: Props) => {
  const { classes, Analytics } = props;

  const handleSelectTimePeriod = () => {
    if (Analytics.selectedTimeInPerformance === '') {
      console.log('selected period is needed');
      return;
    }

    Analytics.getPortfolioPriceHistoryForTimePeriod();
  };

  return (
    <Grid container>
      <Grid container className={classes.header}>
        <Grid item xs={2} sm={2} md={2} className={classes.marginRight}>
          <SelectPeriod />
        </Grid>

        <Grid item xs={1} sm={1} md={1}>
          <Button onClick={() => handleSelectTimePeriod()}>Apply</Button>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={8} sm={8} md={8} className={classes.marginRight}>
          <TotalAssetsValue />
        </Grid>

        <Grid item xs={3} sm={3} md={3}>
          <SummaryPerformanceCard />
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={2} sm={2} md={2} className={classes.marginRight}>
          <SelectBenchmark />
        </Grid>

        <Grid item xs={1} sm={1} md={1}>
          <Button>Apply</Button>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          {/* test  */}
          <PerformanceAssets />
        </Grid>
      </Grid>

    </Grid>
  );
}));

export default withStyles(styles)(Performance);
