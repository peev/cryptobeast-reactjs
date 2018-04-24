import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import Paper from 'material-ui/Paper';
import {
  Tabs,
  Tab,
  TabScrollButton,
  withStyles,
  Typography,
  Grid,
} from 'material-ui';
import Portfolio from './SummaryItems/Portfolio';
import Trending from './SummaryItems/Trending';

const styles = () => ({
  container: {
    height: '350px',
    marginTop: '20px',
  },
  navigation: {
    backgroundColor: '#33435d',
    color: '#FFF',
  },
  content: {
    height: '350px',
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
        <Grid item xs={12} sm={12} md={12}>
          <Tabs
            className={classes.navigation}
            value={this.state.value}
            onChange={this.handleChange}
          >
            <Tab label="Portfolio" value={this.value} />
            <Tab label="Trending" />
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

export default withStyles(styles)(SummaryTabs);
