/* eslint-disable no-restricted-globals */
// @flow
import React from 'react';
import {
  Paper,
  withStyles,
} from '@material-ui/core';
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

const VolatilityRiskCard = inject('Analytics', 'PortfolioStore')(observer(({ ...props }: Props) => {
  const { classes, PortfolioStore } = props;
  return (
    <Paper className={classes.container}>
      <div className={classes.item}>
        <p>STANDARD DEVIATION:</p>
        <p>{isNaN(PortfolioStore.standardDeviation) ? 0 : PortfolioStore.standardDeviation}</p>
      </div>
      <div className={classes.item}>
        <p>PORTFOLIO ALPHA:</p>
        <p>{isNaN(PortfolioStore.portfolioAlpha) ? 0 : BigNumberService.floor(PortfolioStore.portfolioAlpha)}%</p>
      </div>
      <div className={classes.item}>
        <p>PORTFOLIO BETA:</p>
        <p>{isNaN(PortfolioStore.portfolioBeta) ? 0 : BigNumberService.floor(PortfolioStore.portfolioBeta)}</p>
      </div>
      <div className={classes.item}>
        <p>PORTFOLIO VARIANCE:</p>
        <p>{isNaN(PortfolioStore.portfolioVariance) ? 0 : PortfolioStore.portfolioVariance}</p>
      </div>
    </Paper>
  );
}));

export default withStyles(styles)(VolatilityRiskCard);
