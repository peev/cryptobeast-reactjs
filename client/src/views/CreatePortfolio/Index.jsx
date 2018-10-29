// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

import SelectFromPortfolios from '../../components/Tabs/SelectFromPortfolios/SelectFromPortfolios';
import CreateStartPortfolio from '../../components/Tabs/CreatePortfolio/CreateStartPortfolio';

type Props = {
  PortfolioStore: Object,
  portfolios: Array<object>,
  WeidexStore: Object,
  selectedPortfolioId: number,
  location: Object,
};


@inject('PortfolioStore', 'UserStore', 'ApiAccountStore', 'WeidexStore', 'location')
@observer
class CreatePortfolioView extends React.Component<Props> {
  componentWillMount() {
    const addresses = this.getAddresses(this.props.location.search);
    this.props.WeidexStore.sync(addresses);
    this.props.PortfolioStore.getPortfoliosByUserAddresses(addresses);
  }

  getAddresses = (locationSearch: string) => locationSearch.replace('&w=', 'w=').substring(1).split('w=').slice(1);

  // TODO: Enable when we have portfolios
  // if (PortfolioStore.portfolios.length === 1) {
  //   PortfolioStore.selectPortfolio(PortfolioStore.portfolios[0].id);
  //  return <Redirect to="/summary" />;
  // }

  render() {
    return (
      <React.Fragment>
        <SelectFromPortfolios />
      </React.Fragment>
    );
  }
}

export default CreatePortfolioView;
