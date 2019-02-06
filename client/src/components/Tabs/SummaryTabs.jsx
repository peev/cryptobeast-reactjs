// @flow
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { inject, observer } from 'mobx-react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

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
    backgroundColor: '#133140',
    color: '#FFF',
    marginBottom: '6px',
    boxShadow: '0 5px 10px -5px rgba(0,0,0,0.6)',
  },
  content: {
    height: '320px',
    minHeight: '314px',
    '&>div': {
      height: '100%',
      '& :first-child': {
        overflow: 'hidden !important',
      },
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
    maxWidth: '100%',
    '& span': {
      textTransform: 'none',
      fontSize: '16px',
    },
  },
  removePaddingBottom: {
    paddingBottom: '0',
  },
  paper: {
    marginRight: '20px',
  },
  indicator: {
    backgroundColor: 'white',
  },
});

type Props = {
  classes: Object,
  // Analytics: Object,
};

type State = {
  value: ?number,
};

@inject('Analytics')
@observer
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
              classes={{
                indicator: classes.indicator,
              }}
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
      </Paper >
    );
  }
}

export default withStyles(styles)(SummaryTabs);
