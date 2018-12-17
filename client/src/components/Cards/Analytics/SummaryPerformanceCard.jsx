/* eslint-disable no-restricted-globals */
// @flow
import React from 'react';
import {
  Paper,
  withStyles,
} from '@material-ui/core';
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

const SummaryPerformanceCard = inject('Analytics', 'PortfolioStore')(observer(({ ...props }: Props) => {
  const { classes, Analytics, PortfolioStore } = props;

  return (
    <Paper className={classes.container}>
      <div className={classes.item}>
        <p>min:</p>
        <p>${isNaN(PortfolioStore.performanceMin) ? 0 : PortfolioStore.performanceMin}</p>
      </div>
      <div className={classes.item}>
        <p>max:</p>
        <p>${isNaN(PortfolioStore.performanceMax) ? 0 : PortfolioStore.performanceMax}</p>
      </div>
      <div className={classes.item}>
        <p>ath:</p>
        <p>${isNaN(PortfolioStore.performanceMax) ? 0 : PortfolioStore.performanceMax}</p>
      </div>
      <div className={classes.item}>
        <p>profit/loss:</p>
        <p>${PortfolioStore.summaryTotalProfitLossUsd}</p>
      </div>
      <div className={classes.item}>
        <p>avg. change:</p>
        <p>${isNaN(PortfolioStore.avgChangeUsd) ? 0 : PortfolioStore.avgChangeUsd}</p>
      </div>
      <div className={classes.item}>
        <p>last 24h:</p>
        <p>${PortfolioStore.portfolueValueLastDay}</p>
      </div>
      <div className={classes.item}>
        <p>last 7d:</p>
        <p>${PortfolioStore.portfolueValueLastWeek}</p>
      </div>
      {/* <div className={classes.item}>
        <p>top performer:</p>
        <p>{Analytics.performanceTopPerformer}</p>
      </div> */}
    </Paper>
  );
}));

export default withStyles(styles)(SummaryPerformanceCard);
