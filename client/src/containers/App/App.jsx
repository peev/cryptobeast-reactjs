// @flow
import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withStyles } from 'material-ui';
import { inject, observer } from 'mobx-react';
import uuid from 'uuid/v4';
import { Header, Sidebar } from './../../components';
import appRoutes from './../../routes/app';
import appStyle from './../../variables/styles/appStyle';


const switchRoutes = (
  <Switch>
    {appRoutes.map((prop: Object) => {
      if (prop.redirect) { return <Redirect from={prop.path} to={prop.to} key={uuid()} />; }
      return <Route path={prop.path} component={prop.component} key={uuid()} />;
    })}
  </Switch>
);

const switchCreatePortfolioRoutes = (
  <Switch>
    {appRoutes.map((prop: Object) => {
      if (prop.redirect) { return <Redirect from={prop.path} to={prop.to} key={uuid()} />; }
      return <Route path="/summary" component={appRoutes[0].component} key={uuid()} />;
    })}
  </Switch>
);


type Props = {
  classes: Object,
  PortfolioStore: Object,
  UserStore: Object
};

@inject('PortfolioStore', 'UserStore')
@observer
class App extends React.Component<Props> {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes, PortfolioStore, UserStore, ...rest } = this.props;
    const { portfolios } = PortfolioStore;

    return (
      <div>
        {UserStore.data.selectedPortfolio !== undefined ? (
          <div className={classes.wrapper}>
            <Sidebar
              routes={appRoutes}
              handleDrawerToggle={this.handleDrawerToggle}
              open={this.state.mobileOpen}
              {...rest}
            />

            <div className={classes.mainPanel}>
              <Header
                routes={appRoutes}
                handleDrawerToggle={this.handleDrawerToggle}

                {...rest}
              />

              {/*
                  Checks if there are portfolios.
                  If there are none, makes routing array with only summary tabs
              */}
              {portfolios.length > 0 ? (
                <div className={classes.content}>
                  <div className={classes.container}>
                    {switchRoutes}
                  </div>
                </div>
              ) : (
                <div className={classes.content}>
                  <div className={classes.container}>
                    {switchCreatePortfolioRoutes}
                  </div>
                </div>
                )}
            </div>
          </div>
        ) : 'loading...'}
      </div>
    );
  }
}

export default withStyles(appStyle)(App);
