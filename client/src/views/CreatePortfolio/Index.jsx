// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import SelectFromPortfolios from '../../components/Tabs/SelectFromPortfolios/SelectFromPortfolios';
import history from '../../services/History';
import storage from '../../services/storage';

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
    if (addresses.length) {
      this.props.WeidexStore.validateAddresses(addresses);
    } else {
      const storageAddresses = storage.getPortfolioAddresses();
      Promise.resolve(storageAddresses).then((addressesData: Array<string>) => {
        if (addressesData.length) {
          return this.props.WeidexStore.validateAddresses(addressesData);
        } else {
          this.props.PortfolioStore.showContent = true;
        }
      });
    }
  }

  getAddresses = (locationSearch: string) => locationSearch.replace(/&w=/g, 'w=').substring(1).split('w=').slice(1);

  handlePortfoliosLength = () => {
    if (this.props.PortfolioStore.portfolios.length === 0) {
      return ('Please use valid external link');
    } else if (this.props.PortfolioStore.portfolios.length === 1) {
      this.props.PortfolioStore.selectPortfolio(this.props.PortfolioStore.portfolios[0].id);
      return history.push('/summary');
    } else {
      this.props.PortfolioStore.selectPortfolio(0);
      return <SelectFromPortfolios />;
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.props.PortfolioStore.showContent ? this.handlePortfoliosLength() : null}
      </React.Fragment>
    );
  }
}

export default CreatePortfolioView;
