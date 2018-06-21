// @flow
import * as React from 'react';
import { withStyles, Grid, Paper } from 'material-ui';
import { inject, observer } from 'mobx-react';
import selectFromPortfoliosStyles from './SelectFromPortfoliosStyles';
import CreatePortfolio from '../../../components/Modal/CreatePortfolio';
import history from '../../../services/History';


type Props = {
  classes: Object,
  PortfolioStore: Object,
  portfolios: Array<object>,
};

const SelectFromPortfolios = inject('PortfolioStore', 'UserStore')(observer(({ ...props }: Props) => {
  const { classes, PortfolioStore, UserStore } = props;

  const handleClick = (id: number) => {
    // PortfolioStore.selectPortfolio(id);
    UserStore.setPortfolio(id);
    history.push('/summary');
  };

  const portfoliosToSelectFrom = PortfolioStore.portfolios.map((el: object, i: number) => {
    const isLastElementOdd = ((i === PortfolioStore.portfolios.length - 1) && (i % 2 === 0))
      ? <Grid item xs={12} sm={10} md={5} className={classes.grid} key={i} />
      : '';

    return (
      <React.Fragment>
        <Grid item xs={12} sm={10} md={5} className={`${classes.grid} ${''}`} key={i}>
          <Paper className={classes.paper}>
            <div>
              <div>
                <p className={`${classes.generalPStyle} ${classes.portfolioName}`}>{el.name}</p>
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
        {isLastElementOdd}
      </React.Fragment>
    );
  });

  return (
    <Grid container className={classes.containerMain}>
      <Grid item xs={12} sm={12} md={12} className={classes.containerTitle}>
        <p className={classes.title}>To start using CryptoBeast, please select a portfolio to analyze</p>
        <CreatePortfolio place="startScreen" />
      </Grid>

      <Grid container spacing={40} className={classes.containerContent}>
        {portfoliosToSelectFrom}
      </Grid>
    </Grid>
  );
}));

export default withStyles(selectFromPortfoliosStyles)(SelectFromPortfolios);
