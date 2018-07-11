/* globals document */
import React, { createElement } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import uuid from 'uuid/v4';
import { MuiThemeProvider } from 'material-ui';

import './assets/css/material-dashboard-react.css';
import { THEME } from './variables/theme';
import appRoutes from './routes/app';
import App from './containers/App/App';
import CustomRoute from './components/CustomRoute';
import CreatePortfolioView from './views/CreatePortfolio/Index';
import AuthService from './services/Authentication';
import history from './services/History';

import stores from './stores';

if (AuthService.isAuthenticated()) {
  stores.PortfolioStore.setFetchingPortfolios(true);
} else {
  if (!AuthService.isSignedOut()) {
    AuthService.signOut();
  }
}

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
if (process.env.NODE_ENV === 'development') {
  configure({
    enforceActions: true,
    computedRequiresReaction: true,
    disableErrorBoundaries: true,
  });

  enableDevtools();
}
// ====================================

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <Route
        render={props => (
          <MuiThemeProvider theme={THEME}>
            <App {...props} >
              <Switch>
                {appRoutes.map(route => <CustomRoute path={route.path} component={route.component} key={uuid()} />)}
                <Route exact path="/" component={CreatePortfolioView} />
              </Switch>
            </App>
          </MuiThemeProvider>
        )}
      />
    </Router>
  </Provider>,
  document.getElementById('root'),  //eslint-disable-line
);
