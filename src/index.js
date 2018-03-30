import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';

import 'assets/css/material-dashboard-react.css';

import indexRoutes from 'routes/index.jsx';

import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import PortfolioStore from './stores/PortfolioStore';
import AssetStore from './stores/AssetStore';
import InvestorStore from './stores/InvestorStore';
import MarketStore from './stores/MarketStore';
import ApiAccountStore from './stores/ApiAccountStore';

const stores = {
  PortfolioStore,
  AssetStore,
  InvestorStore,
  MarketStore,
  ApiAccountStore,
};

// For easier debugging
// eslint-disable-next-line no-underscore-dangle
window._____APP_STATE_____ = stores;

configure({ enforceActions: true });

const hist = createBrowserHistory();

ReactDOM.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <Provider {...stores}>
    <Router history={hist}>
      <Switch>
        {indexRoutes.map((prop, key) => {
          return <Route path={prop.path} component={prop.component} key={key} />;
        })}
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
