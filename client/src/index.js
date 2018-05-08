import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import uuid from 'uuid/v4';

import './assets/css/material-dashboard-react.css';
import indexRoutes from './routes/index';

import PortfolioStore from './stores/PortfolioStore';
import AssetStore from './stores/AssetStore';
import InvestorStore from './stores/InvestorStore';
import MarketStore from './stores/MarketStore';
import ApiAccountStore from './stores/ApiAccountStore';
import UserStore from './stores/UserStore';
import NotificationStore from './stores/NotificationStore';

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

const hist = createBrowserHistory();

ReactDOM.render(
  <Provider {...stores}>
    <Router history={hist}>
      <Switch>
        {indexRoutes.map(route => <Route path={route.path} component={route.component} key={uuid()} />)}
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'),  //eslint-disable-line
);