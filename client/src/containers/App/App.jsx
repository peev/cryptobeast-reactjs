// @flow
import * as React from 'react';
// import { Switch, Route, Redirect } from 'react-router-dom';
import { withStyles } from 'material-ui';
import { inject, observer } from 'mobx-react';
// import uuid from 'uuid/v4';
import { Header, Sidebar } from './../../components';
// import history from './../../services/History';
import appRoutes from './../../routes/app';
// import CustomRoute from './../../components/CustomRoute';
import appStyle from './../../variables/styles/appStyle';


type Props = {
  classes: Object,
  location: Object,
  PortfolioStore: Object,
  UserStore: Object,
  children?: React.Node
};

@inject('PortfolioStore', 'UserStore')
@observer
class App extends React.Component<Props> {
  state = {
    mobileOpen: false,
  };

  // componentDidUpdate() {
  //   const { PortfolioStore } = this.props;
  //   console.log(PortfolioStore.portfolios.length);
  //   if (PortfolioStore.portfolios.length > 0) {
  //     history.push('/summary');
  //   }
  // }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes, PortfolioStore, UserStore, children, ...rest } = this.props;
    const { fetchingPortfolios } = PortfolioStore;

    if (fetchingPortfolios) return <p style={{ textAlign: 'center', marginTop: '50px' }}> loading...</p>;

    return (
      <div>
        <div className={classes.wrapper}>
          <Sidebar
            routes={appRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            open={this.state.mobileOpen}
            disabled={!PortfolioStore.portfolios.length || !UserStore.data.selectedPortfolio}
            {...rest}
          />
          <div className={classes.mainPanel}>
            <Header {...rest} />
            <div className={classes.content}>
              <div className={classes.container}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(appStyle)(App);
