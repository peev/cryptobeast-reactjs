// @flow
import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import TotalPortfolioValue from '../../HighCharts/TotalPortfolioValue';

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

const Portfolio = inject('PortfolioStore')(observer(({ ...props }: Props) => {
  const { classes } = props;

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} sm={12} md={12} className={classes.gridItem}>
        <TotalPortfolioValue chartHeight={320} />
      </Grid>
    </Grid>
  );
}));

export default withStyles(styles)(Portfolio);
