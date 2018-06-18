// @flow
import * as React from 'react';
import { withStyles } from 'material-ui';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

import Authentication from '../../services/Authentication';
import CreateStartPortfolio from '../../components/Tabs/CreatePortfolio/CreateStartPortfolio';
import SelectFromPortfolios from '../../components/Tabs/SelectFromPortfolios/SelectFromPortfolios';

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
  PortfolioStore: Object,
  portfolios: Array<object>,
  selectedPortfolioId: number,
};

const CreatePortfolioView = inject('PortfolioStore', 'UserStore')(observer(({ ...props }: Props) => {
  const { classes, PortfolioStore, UserStore } = props;

  if (PortfolioStore.portfolios.length === 1) {
    PortfolioStore.selectPortfolio(PortfolioStore.portfolios[0].id);
    return <Redirect to="/summary" />;
  }

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
