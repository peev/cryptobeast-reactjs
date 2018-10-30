// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import SelectFromPortfolios from '../../components/Tabs/SelectFromPortfolios/SelectFromPortfolios';

type Props = {
  PortfolioStore: Object,
  WeidexStore: Object,
  location: Object,
};


@inject('PortfolioStore', 'WeidexStore', 'location')
@observer
class CreatePortfolioView extends React.Component<Props> {
  componentWillMount() {
    const addresses = this.getAddresses(this.props.location.search);
    this.props.WeidexStore.sync(addresses);
    this.props.PortfolioStore.getPortfoliosByUserAddresses(addresses);
  }

  getAddresses = (locationSearch: string) => locationSearch.replace('&w=', 'w=').substring(1).split('w=').slice(1);

  render() {
    const { PortfolioStore } = this.props;
    const handlePortfoliosLength = () => {
      if (PortfolioStore.portfolios.length === 0) {
        return ('Please use valid external link');
      } else {
        return <SelectFromPortfolios />;
      }
    };
    return (
      <React.Fragment>
        {handlePortfoliosLength()}
      </React.Fragment>
    );
  }
}

export default CreatePortfolioView;
