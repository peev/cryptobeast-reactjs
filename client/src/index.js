import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';

import './assets/css/material-dashboard-react.css';

import PortfolioStore from './stores/PortfolioStore';
import AssetStore from './stores/AssetStore';
import InvestorStore from './stores/InvestorStore';
import MarketStore from './stores/MarketStore';
import ApiAccountStore from './stores/ApiAccountStore';
import UserStore from './stores/UserStore';
import NotificationStore from './stores/NotificationStore';

import history from './services/History';
import AuthorizedRoute from './components/AuthorizedRoute';
import App from './containers/App/App';
import Login from './views/Login';


const stores = {
  PortfolioStore,
  AssetStore,
  InvestorStore,
  MarketStore,
  ApiAccountStore,
  UserStore,
  NotificationStore,
};

// For easier debugging
// eslint-disable-next-line no-underscore-dangle
window._____APP_STATE_____ = stores; //eslint-disable-line

configure({ enforceActions: true });

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <Switch>
        <Route path="/login" exact component={Login} />
        <AuthorizedRoute path="/" component={App} />
        <Redirect to="/login" />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'),  //eslint-disable-line
);
