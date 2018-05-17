// @flow
import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withStyles, Grid } from 'material-ui';
import { inject, observer } from 'mobx-react';
import uuid from 'uuid/v4';
import { Header, Sidebar } from './../../components';
import appRoutes from './../../routes/app';
import appStyle from './../../variables/styles/appStyle';
import history from '../../services/History';
import CreatePortfolio from './../../components/Modal/CreatePortfolio';

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
  location: Object,
  PortfolioStore: Object,
  UserStore: Object
};

@inject('PortfolioStore', 'UserStore')
@observer
class App extends React.Component<Props> {
  state = {
    mobileOpen: false,
  };

  componentDidMount() {
    if (this.props.location.pathname === '/') {
      history.replace('/summary');
    }
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes, PortfolioStore, UserStore, ...rest } = this.props;

    const loadingScreen = <p style={{ textAlign: 'center', marginTop: '50px' }}> loading...</p >;

    let mainContent;

    if (PortfolioStore.portfolios.length === 0) {
      mainContent = (
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <p className={classes.warningText}>
              You currently have no portfolio to display. Please create a
              portfolio to start
            </p>
            <CreatePortfolio />
          </Grid>
        </Grid>
      );
    } else if (PortfolioStore.portfolios.length === 1) {
      mainContent = (
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
      );
    } else {
      mainContent = (
        <div className={classes.mainPanel}>
          <Header
            routes={appRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          <p style={{ textAlign: 'center', marginTop: '150px' }}>To start using CryptoBeast, please select a portfolio to analyze</p>
        </div>
      );
    }


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
            {mainContent}
          </div>
        ) : loadingScreen}
      </div>
    );
  }
}

export default withStyles(appStyle)(App);
