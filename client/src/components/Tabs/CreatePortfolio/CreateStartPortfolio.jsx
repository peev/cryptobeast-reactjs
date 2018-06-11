// @flow
import * as React from 'react';
import { withStyles, Grid } from 'material-ui';
import { inject, observer } from 'mobx-react';
import createStartPortfolioStyles from './CreateStartPortfolioStyles';
import CreatePortfolio from '../../../components/Modal/CreatePortfolio';


type Props = {
  classes: Object,
  PortfolioStore: Object,
  portfolios: Array<object>,
};

const CreateStartPortfolio = inject('PortfolioStore')(observer(({ classes, PortfolioStore: { portfolios } }: Props) => {
  // if (portfolios.length > 0) return <Redirect to="/summary" />;

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.container}>
        <h1 className={classes.tittle}>CryptoBeast</h1>
        <p className={classes.subTitle}>
          You currently have no portfolio to display. Please create a portfolio to start
        </p>
        <CreatePortfolio place="startScreen" />
      </Grid>
    </Grid>
  );
}));

export default withStyles(createStartPortfolioStyles)(CreateStartPortfolio);
