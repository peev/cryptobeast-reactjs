// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import {
  withStyles,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';

import appRoutes from './../../routes/app';
import { Header, Sidebar } from './../../components';
import Logo from '../../components/CustomIcons/Sidebar/Logo';
import LogoText from '../../components/CustomIcons/Sidebar/LogoText';
import SidebarRightArrows from '../../components/CustomIcons/Sidebar/SidebarRightArrows';
import SidebarLeftArrows from '../../components/CustomIcons/Sidebar/SidebarLeftArrows';
import AppStyles from './AppStyles';

type Props = {
  classes: Object,
  location: Object,
  theme: Object,
  PortfolioStore: Object,
  MarketStore: Object,
  UserStore: Object,
  WeidexStore: Object,
  children?: React.Node
};

@inject('PortfolioStore', 'UserStore', 'MarketStore', 'UserStore', 'ApiAccountStore', 'WeidexStore', 'location')
@observer
class App extends React.Component<Props> {
  state = {
    open: false,
  };

  componentWillMount() {
    if (this.props.location.pathname === '/') {
      const addresses = this.getAddresses(this.props.location.search);
      if (addresses.length) {
        this.props.WeidexStore.sync(addresses);
      } else {
        this.props.PortfolioStore.getPortfoliosOnStartup();
      }
    } else {
      this.props.PortfolioStore.getPortfoliosOnStartup();
    }
  }

  getAddresses = (locationSearch: string) => locationSearch.replace('&w=', 'w=').substring(1).split('w=').slice(1);

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme, PortfolioStore, WeidexStore, children, ...rest } = this.props;
    const { fetchingPortfolios } = PortfolioStore;

    if (PortfolioStore.fetchingPortfolios) {
      return (
        <div className={classes.progressHolder}>
          <CircularProgress className={classes.progress} size={50} style={{ color: blueGrey[800] }} />
        </div>
      );
    }

    // this is used for portfolio select start screen, because those views doesn't have header
    const checkPortfolioNumber = this.props.location.pathname === '/' && (PortfolioStore.portfolios.length === 0 || PortfolioStore.portfolios.length > 1);

    return (
      <div className={classes.root}>
        {!WeidexStore.snycingData
          ? null
          : (<div className={classes.progressHolder}>
              <CircularProgress className={classes.progress} size={50} style={{ color: blueGrey[800] }} />
             </div>
            )}
        {checkPortfolioNumber
          ? null
          : (<AppBar
            position="absolute"
            className={classNames(classes.appBar, this.state.open && classes.appBarShift, this.state.open && classes.appBarNoPadding)}
            style={{ backgroundColor: '#143141' }}
          >
            <Toolbar className={classNames(!this.state.open && classes.headerPortfolios)}>
              <Header {...rest} />
            </Toolbar>
          </AppBar>)}

        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={`${classes.toolbar} ${classes.combinedLogoContainer}`}>
            <div className={classes.combinedLogo}>
              <Logo className={classes.logo} />
              <LogoText className={classes.logoText} />
            </div>
          </div>
          <Sidebar
            routes={appRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            disabled={checkPortfolioNumber}
            closed={this.state.open}
            {...rest}
          />
          <div className={classes.toolbar}>
            {checkPortfolioNumber ?
              <SidebarRightArrows className={classes.centerDisabledSidebarArrows} /> :
              (checkPortfolioNumber === false && this.state.open === false) ?
                <IconButton>
                  <SidebarRightArrows
                    className={classes.centerActiveSidebarArrows}
                    onClick={this.handleDrawerOpen}
                  />
                </IconButton> :
                (checkPortfolioNumber === false && this.state.open === true) ?
                  <IconButton>
                    <SidebarLeftArrows onClick={this.handleDrawerClose} />
                  </IconButton>
                  : null
            }
          </div>
        </Drawer>
        <main className={`${classes.content} ${this.state.open ? classes.contentOpen : classes.contentClose}`} >
          {children}
        </main>
      </div >
    );
  }
}

export default withStyles(AppStyles, { withTheme: true })(App);
