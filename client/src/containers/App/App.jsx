// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  withStyles,
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  IconButton,
} from 'material-ui';

import appRoutes from './../../routes/app';
import AuthService from './../../services/Authentication';
import { Header, Sidebar } from './../../components';
import MenuIcon from '../../components/CustomIcons/App/MenuIcon';
import ChevronLeftIcon from '../../components/CustomIcons/App/ChevronLeftIcon';
import ChevronRightIcon from '../../components/CustomIcons/App/ChevronRightIcon';
import AppStyles from './AppStyles';

type Props = {
  classes: Object,
  location: Object,
  theme: Object,
  PortfolioStore: Object,
  MarketStore: Object,
  UserStore: Object,
  children?: React.Node
};

@inject('PortfolioStore', 'UserStore', 'MarketStore', 'UserStore')
@observer
class App extends React.Component<Props> {
  state = {
    open: false,
  };

  componentDidMount() {
    const { location, PortfolioStore, MarketStore, UserStore } = this.props;
    UserStore.getUserProfile(); // tries to get user from local storage
    if (!AuthService.isAuthenticated()) {
      if (/access_token|id_token|error/.test(location.hash)) {
        AuthService.receiveAuthentication(location.hash);
      } else {
        AuthService.signIn();
      }
    } else {
      PortfolioStore.getPortfolios().then(() => {
        MarketStore.init();
      });
    }
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme, PortfolioStore, children, ...rest } = this.props;
    const { fetchingPortfolios } = PortfolioStore;

    if (fetchingPortfolios) return <p style={{ textAlign: 'center', marginTop: '50px' }}> loading...</p>;

    // this is used for portfolio select start screen, because those views doesn't have header
    const checkPortfolioNumber = this.props.location.pathname === '/' && (PortfolioStore.portfolios.length === 0 || PortfolioStore.portfolios.length > 1);

    return (
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, this.state.open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            {checkPortfolioNumber
              ? null
              : <Header {...rest} />}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider className={classes.divider} />
          <Sidebar
            routes={appRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            disabled={checkPortfolioNumber}
            closed={this.state.open}
            {...rest}
          />
        </Drawer>
        <main className={`${classes.content} ${this.state.open ? classes.contentOpen : classes.contentClose}`} >
          <div className={classes.toolbar} />
          {children}
        </main>
      </div>
    );
  }
}

export default withStyles(AppStyles, { withTheme: true })(App);
