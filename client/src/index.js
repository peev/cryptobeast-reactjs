/* globals document */
import React, { createElement } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import uuid from 'uuid/v4';
import './assets/css/material-dashboard-react.css';
import appRoutes from './routes/app';
import history from './services/History';
import CustomRoute from './components/CustomRoute';
import App from './containers/App/App';
import CreatePortfolioView from './views/CreatePortfolio/Index';
import AuthService from './services/Authentication';

import PortfolioStore from './stores/PortfolioStore';
import AssetStore from './stores/AssetStore';
import InvestorStore from './stores/InvestorStore';
import MarketStore from './stores/MarketStore';
import ApiAccountStore from './stores/ApiAccountStore';
import UserStore from './stores/UserStore';
import NotificationStore from './stores/NotificationStore';
import Analytics from './stores/Analytics';

if (AuthService.isAuthenticated()) {
  PortfolioStore.setFetchingPortfolios(true);
} else {
  if (!AuthService.isSignedOut()) {
    AuthService.signOut();
  }
}

const stores = {
  PortfolioStore,
  AssetStore,
  InvestorStore,
  MarketStore,
  ApiAccountStore,
  UserStore,
  NotificationStore,
  Analytics,
};

// ====================================
// For easier debugging MobX
function enableDevtools() {
  require(['mobx-react-devtools'], mobxDevtools => {//eslint-disable-line
    const wrapper = document.createElement('div');
    wrapper.id = 'mobx-devtools-wrapper';
    document.body.appendChild(wrapper);
    render(createElement(mobxDevtools.default), wrapper);
  });
}

configure({
  enforceActions: true,
  computedRequiresReaction: true,
  disableErrorBoundaries: true,
});

enableDevtools();
// ====================================

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <Route
        render={props => (
          <App {...props} >
            <Switch>
              {appRoutes.map(route => <CustomRoute path={route.path} component={route.component} key={uuid()} />)}
              <Route exact path="/" component={CreatePortfolioView} />
            </Switch>
          </App>
        )}
      />
    </Router>
  </Provider>,
  document.getElementById('root'),  //eslint-disable-line
);
