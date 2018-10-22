// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

import SelectFromPortfolios from '../../components/Tabs/SelectFromPortfolios/SelectFromPortfolios';

type Props = {
  PortfolioStore: Object,
  portfolios: Array<object>,
  selectedPortfolioId: number,
};

const CreatePortfolioView = inject('PortfolioStore', 'UserStore')(observer(({ ...props }: Props) => {
  const { PortfolioStore } = props;

  // TODO: Enable when we have portfolios
  // if (PortfolioStore.portfolios.length === 1) {
  //   PortfolioStore.selectPortfolio(PortfolioStore.portfolios[0].id);
    return <Redirect to="/summary" />;
  // }

  return (
    <React.Fragment>
      <SelectFromPortfolios />
    </React.Fragment>
  );
}));

export default CreatePortfolioView;
