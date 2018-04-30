import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {
  Tabs,
  Tab,
  withStyles,
} from 'material-ui';
import Volatility from './AnalyticsItems/Volatility';
import Performance from './AnalyticsItems/Performance';

const styles = () => ({
  navigation: {
    backgroundColor: '#33435d',
    color: '#FFF',
    marginTop: '-10px',
    marginLeft: '-30px',
    marginRight: '-30px',
    position: 'fixed',
    width: '100%',
    zIndex: 1,
    top: '100px',
  },
  navbtn: {
    marginLeft: '20px',
  },
});

class AnalyticsTabs extends React.Component {
  state = {
    value: null,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Tabs
          className={classes.navigation}
          value={this.state.value}
          onChange={this.handleChange}
        >
          <Tab label="Performance" value={this.value} />
          <Tab label="Volatility/Risk" />
          <Tab label="Profit/Loss" />
          <Tab label="Liquidity" />
          <Tab label="Correlation matrix" />
        </Tabs>

        <br />

        <SwipeableViews
          index={this.state.value}
          onChange={this.handleChange}
        >
          <Performance />

          <Volatility />

          <div>
            <h2>Profit/Loss</h2>
          </div>

          <div>
            <h2>Liquidity</h2>
          </div>

          <div>
            <h2>Correlation matrix</h2>
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

export default withStyles(styles)(AnalyticsTabs);
