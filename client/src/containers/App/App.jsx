// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui';
import { inject, observer } from 'mobx-react';

import { Header, Sidebar } from './../../components';
import appRoutes from './../../routes/app';
import appStyle from './../../variables/styles/appStyle';
import AuthService from './../../services/Authentication';

type Props = {
  classes: Object,
  location: Object,
  PortfolioStore: Object,
  MarketStore: Object,
  UserStore: Object,
  children?: React.Node
};

@inject('PortfolioStore', 'UserStore', 'MarketStore')
@observer
class App extends React.Component<Props> {
  state = {
    mobileOpen: false,
  };

  componentDidMount() {
    const { location, PortfolioStore, MarketStore } = this.props;
    if (!AuthService.isAuthenticated()) {
      if (/access_token|id_token|error/.test(location.hash)) {
        AuthService.receiveAuthentication(location.hash);
      } else {
        AuthService.signIn();
      }
    } else {
      PortfolioStore.getPortfolios().then(() => {
        MarketStore.init();
      });
    }
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes, PortfolioStore, UserStore, children, ...rest } = this.props;
    const { fethingPortfolios } = PortfolioStore;

    if (fethingPortfolios) return <p style={{ textAlign: 'center', marginTop: '50px' }}> loading...</p>;

    return (
      <div>
        <div className={classes.wrapper}>
          <Sidebar
            routes={appRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            open={this.state.mobileOpen}
            disabled={!PortfolioStore.portfolios.length || !UserStore.data.selectedPortfolio}
            {...rest}
          />
          <div className={classes.mainPanel}>
            <Header {...rest} />
            <div className={classes.content}>
              <div className={classes.container}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(appStyle)(App));
