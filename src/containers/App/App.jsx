import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
// creates a beautiful scrollbar
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import { withStyles } from 'material-ui';
import { inject, observer } from 'mobx-react';

import { Header, Sidebar } from 'components';

import appRoutes from 'routes/app.jsx';

import appStyle from 'variables/styles/appStyle.jsx';


const switchRoutes = (
  <Switch>
    {appRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.to} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);

const switchCreatePortfolioRoutes = (
  <Switch>
    {appRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.to} key={key} />;
      return <Route path="/summary" component={appRoutes[0].component} key={key} />;
    })}
  </Switch>
);

@inject('PortfolioStore')
@observer
class App extends React.Component {
  state = {
    mobileOpen: false,
    username: '',
  };

  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      // eslint-disable-next-line
      const ps = new PerfectScrollbar(this.refs.mainPanel);
    }
  }

  componentDidUpdate() {
    this.refs.mainPanel.scrollTop = 0;
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes, PortfolioStore, ...rest } = this.props;
    const portfoliosArray = Object.keys(PortfolioStore.getAllPortfolios);

    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={appRoutes}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          {...rest}
        />

        <div className={classes.mainPanel} ref="mainPanel">
          <Header
            routes={appRoutes}
            handleDrawerToggle={this.handleDrawerToggle}

            {...rest}
          />

          {/*
              Checks if there are portfolios.
              If there are none, makes routing array with only summary tabs
          */}
          {portfoliosArray.length > 0 ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
              <div className={classes.content}>
                <div className={classes.container}>{switchCreatePortfolioRoutes}</div>
              </div>
            )}
        </div>
      </div >
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(appStyle)(App);
