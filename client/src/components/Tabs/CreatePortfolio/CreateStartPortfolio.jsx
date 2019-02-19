// @flow
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { inject, observer } from 'mobx-react';
import createStartPortfolioStyles from './CreateStartPortfolioStyles';

type Props = {
  classes: Object,
  PortfolioStore: Object,
  portfolios: Array<object>,
};

const CreateStartPortfolio = inject('PortfolioStore')(observer(({ classes, PortfolioStore: { portfolios, selectedPortfolioId } }: Props) => {
  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.container}>
        <h1 className={classes.tittle}>WeiBeast</h1>
        <p className={classes.subTitle}>
          You currently have no portfolio to display. Please create a portfolio to start
        </p>
      </Grid>
    </Grid>
  );
}));

export default withStyles(createStartPortfolioStyles)(CreateStartPortfolio);
