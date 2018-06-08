// @flow
import * as React from 'react';
import { withStyles } from 'material-ui';
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
    <React.Fragment>
      <p className={'test'}>
        You currently have no portfolio to display. Please create a
        portfolio to start
      </p>
      <CreatePortfolio />
    </React.Fragment>
  );
}));

export default withStyles(createStartPortfolioStyles)(CreateStartPortfolio);
