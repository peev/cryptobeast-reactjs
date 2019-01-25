// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router';
import SelectFromPortfolios from '../../components/Tabs/SelectFromPortfolios/SelectFromPortfolios';
import storage from '../../services/storage';

type Props = {
  WeidexStore: Object,
  location: Object,
  LoadingStore: Object,
};

@inject('WeidexStore', 'location', 'LoadingStore')
@observer
class CreatePortfolioView extends React.Component<Props> {
  componentDidMount() {
    this.handleStart();
  }

  handleStart = () => {
    const addresses = this.getAddresses(this.props.location.search);
    if (addresses.length) {
      this.props.WeidexStore.validateAddresses(addresses);
    } else {
      const storageAddresses = storage.getPortfolioAddresses();
      Promise.resolve(storageAddresses).then((addressesData: Array<string>) => {
        if (addressesData && addressesData.length) {
          return this.props.WeidexStore.validateAddresses(addressesData);
        } else {
          this.props.LoadingStore.showErrorPage = true;
          return this.props.LoadingStore.setShowContent(true);
        }
      });
    }
  }

  getAddresses = (locationSearch: string) => locationSearch.replace(/&w=/g, 'w=').substring(1).split('w=').slice(1);

  handlePortfoliosLength = () => {
    if (this.props.LoadingStore.ableToLogin) {
      return <Redirect to="/summary" />;
    } else {
      return this.props.LoadingStore.showErrorPage ? ('Please use valid external link') : <SelectFromPortfolios />;
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.props.LoadingStore.showContent ? this.handlePortfoliosLength() : null}
      </React.Fragment>
    );
  }
}

export default CreatePortfolioView;
