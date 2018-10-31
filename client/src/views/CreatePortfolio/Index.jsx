// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import SelectFromPortfolios from '../../components/Tabs/SelectFromPortfolios/SelectFromPortfolios';
import history from '../../services/History';

type Props = {
  PortfolioStore: Object,
  UserStore: Object,
  WeidexStore: Object,
};

const CreatePortfolioView = inject('PortfolioStore', 'UserStore', 'WeidexStore')(observer(({ ...props }: Props) => {
  const { PortfolioStore, UserStore, WeidexStore } = props;

  const handlePortfoliosLength = () => {
    if (PortfolioStore.portfolios.length === 0) {
      return ('Please use valid external link');
    } else if (PortfolioStore.portfolios.length === 1) {
      PortfolioStore.selectPortfolio(PortfolioStore.portfolios[0].id);
      UserStore.setPortfolio(PortfolioStore.portfolios[0].id);
      return history.push('/summary');
    } else {
      PortfolioStore.selectPortfolio(0);
      UserStore.setPortfolio(0);
      return <SelectFromPortfolios />;
    }
  };

  return (
    <React.Fragment>
      {!WeidexStore.snycingData && !PortfolioStore.fetchingPortfolios ? handlePortfoliosLength() : null}
    </React.Fragment>
  );
}));

export default CreatePortfolioView;
