// @flow
import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import PerformanceChart from '../../HighCharts/PerformanceChart';
import TotalAssetsValue from '../../HighCharts/TotalAssetsValue';

const styles = () => ({
  container: {
    margin: '0',
    height: '100%',
    width: '100%',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  gridItem: {
    width: '100%',
    height: '100%',
    margin: '0',
    padding: '0 !important',
  },
});

type Props = {
  classes: Object,
  Allocations: Object,
};

const Portfolio = inject('Analytics', 'PortfolioStore', 'Allocations')(observer(({ ...props }: Props) => {
  const { classes, Allocations } = props;

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} sm={12} md={12} className={classes.gridItem}>
        {Allocations.allocations.length > 0 ? <TotalAssetsValue chartHeight={320} /> : ''}
      </Grid>
    </Grid>
  );
}));

export default withStyles(styles)(Portfolio);
