import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';

import 'assets/css/material-dashboard-react.css';

import indexRoutes from 'routes/index.jsx';

import { Provider } from 'mobx-react';
import PortfolioStore from './stores/PortfolioStore';
import AssetStore from './stores/AssetStore';
import InvestorStore from './stores/InvestorStore';

const stores = {
  PortfolioStore,
  AssetStore,
  InvestorStore
};

// For easier debugging
window._____APP_STATE_____ = stores;

const hist = createBrowserHistory();

ReactDOM.render(
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
