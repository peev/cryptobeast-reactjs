// @flow
import React from 'react';
import { withStyles, Grid } from 'material-ui';
import PerformanceChart from '../../HighCharts/PerformanceChart';

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
};

const Portfolio = (props: Props) => {
  const { classes } = props;

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} sm={12} md={12} className={classes.gridItem}>
        <PerformanceChart />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Portfolio);
