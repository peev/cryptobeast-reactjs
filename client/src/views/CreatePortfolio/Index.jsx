// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
//import { Redirect } from 'react-router-dom';

import Authentication from '../../services/Authentication';
import CreateStartPortfolio from '../../components/Tabs/CreatePortfolio/CreateStartPortfolio';
import SelectFromPortfolios from '../../components/Tabs/SelectFromPortfolios/SelectFromPortfolios';
import storage from '../../services/storage';

const styles = () => ({
  loginButton: {
    marginLeft: '40px',
    padding: '10px 40px',
    color: 'white',
    backgroundColor: '#4D5265',
    border: 'none',
    fontSize: '14px',
    textTransform: 'uppercase',
    '&:hover': {
      cursor: 'pointer',
      color: 'black',
      backgroundColor: '#8A8E9B',
    },
  },
});

type Props = {
  WeidexStore: Object,
  location: Object,
  LoadingStore: Object,
};

const CreatePortfolioView = inject('PortfolioStore', 'UserStore')(observer(({ ...props }: Props) => {
  const { classes, PortfolioStore, UserStore } = props;

  // const handleStart = () => {
  //   const addresses = this.getAddresses(this.props.location.search);
  //   if (addresses.length) {
  //     this.props.WeidexStore.validateAddresses(addresses);
  //   } else {
  //     const storageAddresses = storage.getPortfolioAddresses();
  //     Promise.resolve(storageAddresses).then((addressesData: Array<string>) => {
  //       if (addressesData && addressesData.length) {
  //         return this.props.WeidexStore.validateAddresses(addressesData);
  //       } else {
  //         this.props.LoadingStore.showErrorPage = true;
  //         return this.props.LoadingStore.setShowContent(true);
  //       }
  //     });
  //   }
  // }

  const handleSignIn = () => {
    Authentication.signIn();
  };

  const userView = PortfolioStore.portfolios.length === 0
    ? <CreateStartPortfolio />
    : <SelectFromPortfolios />;

  const loginView = (
    <button
      className={classes.loginButton}
      onClick={() => handleSignIn()}
    >Login
    </button>
  );

  return (
    <React.Fragment>
      {UserStore.profile.sub ? userView : loginView}
    </React.Fragment>
  );
}));

export default withStyles(styles)(CreatePortfolioView);
