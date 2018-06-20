// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles, MuiThemeProvider } from 'material-ui';
import { inject, observer } from 'mobx-react';

import { THEME } from './../../variables/theme';
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

@inject('PortfolioStore', 'UserStore', 'MarketStore', 'UserStore')
@observer
class App extends React.Component<Props> {
  state = {
    mobileOpen: false,
  };

  componentDidMount() {
    const { location, PortfolioStore, MarketStore, UserStore } = this.props;
    UserStore.getUserProfile(); // tries to get user from local storage
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
    const { fetchingPortfolios } = PortfolioStore;

    // this is used for portfolio select start screen, because those views doesn't have header
    const checkPortfolioNumber = this.props.location.pathname === '/' && (PortfolioStore.portfolios.length === 0 || PortfolioStore.portfolios.length > 1);

    if (fetchingPortfolios) return <p style={{ textAlign: 'center', marginTop: '50px' }}> loading...</p>;

    return (
      <MuiThemeProvider theme={THEME}>
        <div className={classes.wrapper}>
          <Sidebar
            routes={appRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            open={this.state.mobileOpen}
            disabled={checkPortfolioNumber}
            {...rest}
          />
          <div className={classes.mainPanel}>
            {checkPortfolioNumber
              ? null
              : <Header {...rest} />}
            <div className={classes.content}>
              <div className={classes.container}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(withStyles(appStyle)(App));
