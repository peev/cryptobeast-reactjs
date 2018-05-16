// @flow
import React from 'react';
import Paper from 'material-ui/Paper';
import { withStyles, Grid } from 'material-ui';

import Button from '../../CustomButtons/Button';
import SelectBenchmark from '../../Selectors/Analytics/SelectBenchmark';
import SelectPeriod from '../../Selectors/Analytics/SelectPeriod';
import PerformanceChart from '../../HighCharts/PerformanceChart';
import SummaryPerformanceCard from '../../Cards/Analytics/SummaryPerformanceCard';

const styles = () => ({
  marginTop: {
    marginTop: '40px',
  },
});

type Props = {
  classes: Object,
};

const Performance = ({ ...props }: Props) => { // eslint-disable-line
  const { classes } = props;

  return (
    <Grid container>
      <Grid container spacing={24}>
        <Grid item xs={2} sm={2} md={2}>
          <SelectPeriod />
        </Grid>

        <Grid item xs={1} sm={1} md={1}>
          <Button>Apply</Button>
        </Grid>
      </Grid>

      <Grid container spacing={24}>
        <Grid item xs={9} sm={9} md={9}>
          <Paper>
            <PerformanceChart />
          </Paper>
        </Grid>

        <Grid item xs={3} sm={3} md={3}>
          <SummaryPerformanceCard />
        </Grid>
      </Grid>

      <Grid container spacing={24}>
        <Grid item xs={2} sm={2} md={2}>
          <SelectBenchmark />
        </Grid>

        <Grid item xs={1} sm={1} md={1}>
          <Button>Apply</Button>
        </Grid>
      </Grid>

      {/* Tests bellow */}
      <Grid container className={classes.marginTop}>
        <Grid item xs={12} sm={12} md={12}>
          <PerformanceChart />
        </Grid>
      </Grid>

      <Grid container className={classes.marginTop}>
        <Grid item xs={12} sm={12} md={12}>
          <PerformanceChart />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Performance);
