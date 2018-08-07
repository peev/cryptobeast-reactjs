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
} from 'material-ui';

import appRoutes from './../../routes/app';
import AuthService from './../../services/Authentication';
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
  children?: React.Node
};

@inject('PortfolioStore', 'UserStore', 'MarketStore', 'UserStore')
@observer
class App extends React.Component<Props> {
  state = {
    open: false,
  };

  componentDidMount() {
    const { location, UserStore } = this.props;
    UserStore.getUserProfile(); // tries to get user from local storage
    if (!AuthService.isAuthenticated()) {
      if (/access_token|id_token|error/.test(location.hash)) {
        AuthService.receiveAuthentication(location.hash);
      } else {
        AuthService.signIn();
      }
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
        {checkPortfolioNumber
          ? null
          : (<AppBar
            position="absolute"
            className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
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
          <div className={`${classes.toolbar} ${classes.combnedLogoContainer}`}>
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
