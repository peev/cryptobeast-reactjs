// @flow
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { inject, observer } from 'mobx-react';
import selectFromPortfoliosStyles from './SelectFromPortfoliosStyles';
import history from '../../../services/History';
import BigNumberService from '../../../services/BigNumber';

type Props = {
  classes: Object,
  PortfolioStore: Object,
  portfolios: Array<object>,
};

const SelectFromPortfolios = inject('PortfolioStore', 'UserStore')(observer(({ ...props }: Props) => {
  const { classes, PortfolioStore } = props;

  const handleClick = (id: number) => {
    PortfolioStore.selectPortfolio(id, true);
    history.push('/summary');
  };

  const portfoliosToSelectFrom = PortfolioStore.stats.map((el: object, i: number) => (
    <Grid item xs={12} sm={10} md={5} className={`${classes.grid} ${''}`} key={i}>
      <Paper className={classes.paper}>
        <div>
          <div>
            <p className={`${classes.generalPStyle} ${classes.portfolioName}`}>{el.name || el.address}</p>
            <span className={`${classes.portfolioPercent} ${el.totalProfitLost >= 0 ? classes.positivePercent : classes.negativePercent}`}>
              {el.totalProfitLost >= 0 ? '^' : null} {BigNumberService.floor(el.totalProfitLost)}%
            </span>
          </div>

          <div className={classes.marginTop}>
            <p className={classes.generalPStyle}>USD</p>
            <span className={classes.portfolioValue}>{BigNumberService.floor(el.portfolioCostInUSD)}</span>
          </div>
        </div>

        <div className={`${classes.buttonContainer} ${classes.marginTop}`}>
          <button
            className={classes.button}
            onClick={() => handleClick(el.id)}
          >
            select
          </button>
        </div>
      </Paper>
    </Grid >
  ));

  return (
    <Grid container className={classes.containerMain}>
      <Grid container spacing={40} className={classes.containerContent}>
        {portfoliosToSelectFrom}
        <Grid item xs={12} sm={10} md={5} className={classes.grid} key={0.0} />
      </Grid>
    </Grid>
  );
}));

export default withStyles(selectFromPortfoliosStyles)(SelectFromPortfolios);
