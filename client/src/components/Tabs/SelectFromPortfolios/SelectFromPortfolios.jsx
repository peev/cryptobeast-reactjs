// @flow
import * as React from 'react';
import { withStyles, Grid, Paper } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import selectFromPortfoliosStyles from './SelectFromPortfoliosStyles';
import history from '../../../services/History';


type Props = {
  classes: Object,
  PortfolioStore: Object,
  portfolios: Array<object>,
};

const SelectFromPortfolios = inject('PortfolioStore', 'UserStore')(observer(({ ...props }: Props) => {
  const { classes, PortfolioStore } = props;

  const handleClick = (id: number) => {
    PortfolioStore.selectPortfolio(id);
    PortfolioStore.loadData();
    history.push('/summary');
  };

  const portfoliosToSelectFrom = PortfolioStore.portfolios.map((el: object, i: number) => {
    return (
      <Grid item xs={12} sm={10} md={5} className={`${classes.grid} ${''}`} key={i}>
        <Paper className={classes.paper}>
          <div>
            <div>
              <p className={`${classes.generalPStyle} ${classes.portfolioName}`}>{el.portfolioName || el.userAddress}</p>
              <span className={`${classes.portfolioPercent} ${i >= 0 ? classes.positivePercent : classes.negativePercent}`}>{` ^ ${8.45 + i}%`}</span>
            </div>

            <div className={classes.marginTop}>
              <p className={classes.generalPStyle}>USD</p>
              <span className={classes.portfolioValue}>{985648 + i}</span>
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
    );
  });

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
