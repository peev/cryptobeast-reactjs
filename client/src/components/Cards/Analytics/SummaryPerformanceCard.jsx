/* eslint-disable no-restricted-globals */
// @flow
import React from 'react';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { inject, observer } from 'mobx-react';
import BigNumberService from '../../../services/BigNumber';

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
  const { classes, PortfolioStore } = props;

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
        <p>{isNaN(PortfolioStore.summaryTotalProfitLoss) ? 0 : BigNumberService.floor(PortfolioStore.summaryTotalProfitLoss)}%</p>
      </div>
      <div className={classes.item}>
        <p>avg. change:</p>
        <p>{isNaN(PortfolioStore.avgChange) ? 0 : BigNumberService.floor(PortfolioStore.avgChange)}%</p>
      </div>
      <div className={classes.item}>
        <p>last 24h:</p>
        <p>{BigNumberService.floor(PortfolioStore.portfolueValueLastDay)}%</p>
      </div>
      <div className={classes.item}>
        <p>last 7d:</p>
        <p>{BigNumberService.floor(PortfolioStore.portfolueValueLastWeek)}%</p>
      </div>
    </Paper>
  );
}));

export default withStyles(styles)(SummaryPerformanceCard);
