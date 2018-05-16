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

    const loadingScreen = <p style={{ textAlign: 'center', marginTop: '50px' }}> loading...</p >;

    // test view for select portfolio
    const selectFromMultiplePortfolios = (
      <div className={classes.mainPanel}>
        <Header
          {...rest}
        />
        <p style={{ textAlign: 'center', marginTop: '150px' }}>To start using CryptoBeast, please select a portfolio to analyze</p>
      </div>
    );

    return (
      <div>
        {PortfolioStore.portfolios !== undefined ? (
          <div className={classes.wrapper}>
            <Sidebar
              routes={appRoutes}
              handleDrawerToggle={this.handleDrawerToggle}
              open={this.state.mobileOpen}
              disabled={UserStore.data.selectedPortfolio === 0}
              {...rest}
            />

            {/*
              Checks if there is selected portfolio id. More then 0, because 0 is
              default value for Select element.
            */}
            {PortfolioStore.selectedPortfolioId > 0 ? (
              <div className={classes.mainPanel}>
                <Header
                  routes={appRoutes}
                  handleDrawerToggle={this.handleDrawerToggle}

                  {...rest}
                />

                <div className={classes.content}>
                  <div className={classes.container}>{switchRoutes}</div>
                </div>
              </div>
            ) : selectFromMultiplePortfolios}
          </div>
        ) : loadingScreen}
      </div>
    );
  }
}

export default withStyles(appStyle)(App);
