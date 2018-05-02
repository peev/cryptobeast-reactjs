import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import {
  Tabs,
  Tab,
  withStyles,
  Grid,
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
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  tabItem: {
    width: '50%',
    height: '41px',
    minHeight: '41px',
  },
  removePaddingBottom: {
    paddingBottom: '0',
  },
});

class SummaryTabs extends React.Component {
  state = {
    value: null,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.container}>
        <Grid item xs={12} sm={12} md={12} className={classes.removePaddingBottom}>
          <Tabs
            className={classes.navigation}
            value={this.state.value}
            onChange={this.handleChange}
            centered="true"
            indicatorColor="#eb4562"
          >
            <Tab label="Portfolio" value={this.value} className={classes.tabItem} />
            <Tab label="Trending" className={classes.tabItem} />
          </Tabs>

          <SwipeableViews
            index={this.state.value}
            onChange={this.handleChange}
            className={classes.content}
          >
            <Portfolio tableHead={[
              'Name',
              'Status',
            ]}
            />

            <Trending tableHead={[
              'Ticker',
              '24H Change',
              '7D Change',
            ]}
            />
          </SwipeableViews>
        </Grid>
      </Grid>
    );
  }
}

SummaryTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SummaryTabs);
