// @flow
import * as React from 'react';
import { withStyles } from 'material-ui';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

import appStyle from './../../variables/styles/appStyle';
import CreateStartPortfolio from '../../components/Tabs/CreatePortfolio/CreateStartPortfolio';
import SelectFromPortfolios from '../../components/Tabs/CreatePortfolio/SelectFromPortfolios';

type Props = {
  PortfolioStore: Object,
  portfolios: Array<object>,
  selectedPortfolioId: number,
};

const CreatePortfolioView = inject('PortfolioStore')(observer(({ PortfolioStore: { portfolios, selectedPortfolioId } }: Props) => {
  if (portfolios.length === 1) {
    selectedPortfolioId = portfolios[0].id;
    return <Redirect to="/summary" />;
  }

  return (
    <React.Fragment>
      {portfolios.length === 0
        ? <CreateStartPortfolio />
        : <SelectFromPortfolios />
      }
    </React.Fragment>
  );
}));

export default withStyles(appStyle)(CreatePortfolioView);
