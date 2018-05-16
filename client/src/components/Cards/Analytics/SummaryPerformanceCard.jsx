// @flow
import React from 'react';
import {
  Paper,
  withStyles,
} from 'material-ui';
import { inject, observer } from 'mobx-react';

const styles = () => ({
  container: {
    padding: '0 20px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

});

type Props = {
  classes: Object,
  PortfolioStore: Object,
};

const SummaryPerformanceCard = inject('PortfolioStore')(observer(({ ...props }: Props) => {
  const { classes } = props;

  return (
    <Paper className={classes.container}>
      <div className={classes.item}>
        <p>min:</p>
        <p>value</p>
      </div>
      <div className={classes.item}>
        <p>max:</p>
        <p>value</p>
      </div>
      <div className={classes.item}>
        <p>ath:</p>
        <p>value</p>
      </div>
      <div className={classes.item}>
        <p>profit/loss:</p>
        <p>value</p>
      </div>
      <div className={classes.item}>
        <p>avg. change:</p>
        <p>value</p>
      </div>
      <div className={classes.item}>
        <p>last 24h:</p>
        <p>value</p>
      </div>
      <div className={classes.item}>
        <p>last 7d:</p>
        <p>value</p>
      </div>
      <div className={classes.item}>
        <p>top performer:</p>
        <p>value</p>
      </div>
    </Paper>
  );
}));

export default withStyles(styles)(SummaryPerformanceCard);
