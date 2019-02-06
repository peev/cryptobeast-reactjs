// @flow
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import withStyles from '@material-ui/core/styles/withStyles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { inject, observer } from 'mobx-react';
import Volatility from './AnalyticsItems/Volatility';
import Performance from './AnalyticsItems/Performance';
import ProfitLoss from './AnalyticsItems/ProfitLoss';

const styles = () => ({
  // TODO: Refactor this
  navigation: {
    backgroundColor: '#33435d',
    color: '#FFF',
    marginTop: '-20px',
    marginLeft: '-50px',
    marginRight: '0',
    position: 'fixed',
    width: '100%',
    zIndex: 1,
    top: '100px',
  },
  view: {
    marginTop: '45px',
  },
});

type Props = {
  classes: Object,
};

type State = {
  value: ?number,
};

@inject('Analytics')
@observer
class AnalyticsTabs extends React.Component<Props, State> {
  state = {
    value: 0,
  };

  handleChange = (event: SyntheticEvent, value: number) => {
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
          indicatorColor="primary"
        >
          <Tab label="Performance" value={this.value} />
          <Tab label="Volatility/Risk" />
          <Tab label="Profit/Loss" />
        </Tabs>

        <SwipeableViews
          index={this.state.value}
          onChange={this.handleChange}
          className={classes.view}
        >
          <Performance />
          <Volatility />
          <ProfitLoss />
        </SwipeableViews>
      </div>
    );
  }
}

export default withStyles(styles)(AnalyticsTabs);
