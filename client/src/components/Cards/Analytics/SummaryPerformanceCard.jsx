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
  },
  green: {
    color: '#2b908f'
  },
  red: {
    color: '#ca3f58'
  }

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
        <p>Мin:</p>
        {/* <p>{`$${Number(`${Math.round(`${Analytics.performanceMin}e2`)}e-2`)}`}</p> */}
        <p>1000.00 USD</p>
      </div>
      <div className={classes.item}>
        <p>Мax:</p>
        {/* <p>{`$${Number(`${Math.round(`${Analytics.performanceMax}e2`)}e-2`)}`}</p> */}
        <p>3474.58 USD</p>
      </div>
      <div className={classes.item}>
        <p>ATH:</p>
        {/* <p>{`$${Number(`${Math.round(`${Analytics.performanceATH}e2`)}e-2`)}`}</p> */}
        <p>3474.58 USD</p>
      </div>
      <div className={classes.item}>
        <p>Profit/Loss:</p>
        {/* <p>{`${Number(`${Math.round(`${Analytics.performanceProfitLoss}e2`)}e-2`)}%`}</p> */}
        <p className={classes.green}>162.38%</p>
      </div>
      {/* <div className={classes.item}>
        <p>avg. change:</p>
        <p>{`${Number(`${Math.round(`${Analytics.performanceAverageChange}e2`)}e-2`)}%`}</p>
      </div> */}
      <div className={classes.item}>
        <p>24H:</p>
        {/* <p>{`${Number(`${Math.round(`${Analytics.performanceLast24H}e2`)}e-2`)}%`}</p> */}
        <p className={classes.green}>6.12%</p>
      </div>
      <div className={classes.item}>
        <p>7D:</p>
        {/* <p>{`${Number(`${Math.round(`${Analytics.performanceLast7D}e2`)}e-2`)}%`}</p> */}
        <p className={classes.red}>-3.18%</p>
      </div>
      {/* <div className={classes.item}>
        <p>top performer:</p>
        <p>{Analytics.performanceTopPerformer}</p>
      </div> */}
    </Paper>
  );
}));

export default withStyles(styles)(SummaryPerformanceCard);
