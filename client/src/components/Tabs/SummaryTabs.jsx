// @flow
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {
  Tabs,
  Tab,
  withStyles,
  Grid,
  Paper,
} from 'material-ui';

import Portfolio from './SummaryItems/Portfolio';
import Trending from './SummaryItems/Trending';

const styles = () => ({
  container: {
    height: '363px',
    marginTop: '-16px',
  },
  navigation: {
    height: '41px',
    minHeight: '41px',
    backgroundColor: '#4c5265',
    color: '#FFF',
  },
  content: {
    height: '314px',
    minHeight: '314px',
    '&>div': {
      height: '100%',
    },
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  tabItem: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    width: '50%',
    height: '41px',
    minHeight: '41px',
  },
  removePaddingBottom: {
    paddingBottom: '0',
  },
  paper: {
    marginRight: '20px',
  },
});

type Props = {
  classes: Object,
};

type State = {
  value: ?number,
};

class SummaryTabs extends React.Component<Props, State> {
  state = {
    value: 0,
  };

  handleChange = (event: SyntheticEvent, value: number) => {
    this.setState({ value });
  };
  render() {
    const { classes } = this.props;
    const centered = true;
    return (
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} className={classes.removePaddingBottom}>
            <Tabs
              className={classes.navigation}
              value={this.state.value}
              onChange={this.handleChange}
              centered={centered}
              indicatorColor="primary"
            >
              <Tab label="Portfolio" value={this.value} className={classes.tabItem} />
              <Tab label="Trending" className={classes.tabItem} />
            </Tabs>

            <SwipeableViews
              index={this.state.value}
              onChange={this.handleChange}
              className={classes.content}
            >
              <Portfolio />

              <Trending tableHead={[
                'Ticker',
                '24H Change',
                '7D Change',
              ]}
              />
            </SwipeableViews>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(SummaryTabs);
