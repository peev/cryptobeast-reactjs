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

const SummaryPerformanceCard = inject('Analytics')(observer(({ ...props }: Props) => {
  const { classes, Analytics } = props;

  return (
    <Paper className={classes.container}>
      <div className={classes.item}>
        <p>min:</p>
        <p>{`$${Number(`${Math.round(`${Analytics.performanceMin}e2`)}e-2`)}`}</p>
      </div>
      <div className={classes.item}>
        <p>max:</p>
        <p>{`$${Number(`${Math.round(`${Analytics.performanceMax}e2`)}e-2`)}`}</p>
      </div>
      <div className={classes.item}>
        <p>ath:</p>
        <p>{`$${Number(`${Math.round(`${Analytics.performanceATH}e2`)}e-2`)}`}</p>
      </div>
      <div className={classes.item}>
        <p>profit/loss:</p>
        <p>{`${Number(`${Math.round(`${Analytics.performanceProfitLoss}e2`)}e-2`)}%`}</p>
      </div>
      <div className={classes.item}>
        <p>avg. change:</p>
        <p>{`${Number(`${Math.round(`${Analytics.performanceAverageChange}e2`)}e-2`)}%`}</p>
      </div>
      <div className={classes.item}>
        <p>last 24h:</p>
        <p>{`${Number(`${Math.round(`${Analytics.performanceLast24H}e2`)}e-2`)}%`}</p>
      </div>
      <div className={classes.item}>
        <p>last 7d:</p>
        <p>{`${Number(`${Math.round(`${Analytics.performanceLast7D}e2`)}e-2`)}%`}</p>
      </div>
      <div className={classes.item}>
        <p>top performer:</p>
        <p>{Analytics.performanceTopPerformer}</p>
      </div>
    </Paper>
  );
}));

export default withStyles(styles)(SummaryPerformanceCard);
