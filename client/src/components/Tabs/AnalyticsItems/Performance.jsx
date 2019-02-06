// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { inject, observer } from 'mobx-react';
import TotalAssetsValue from '../../HighCharts/TotalAssetsValue';
import SummaryPerformanceCard from '../../Cards/Analytics/SummaryPerformanceCard';
import SharePriceChart from '../../HighCharts/SharePriceChart';

const styles = () => ({
  marginTop: {
    marginTop: '40px',
  },
  marginRight: {
    marginRight: '75px',
  },
  header: {
    color: '#ca3f58',
    margin: '20px 0',
  },
  flex: {
    display: 'flex',
    'flex-direction': 'column',
    'text-align': 'center',
  },
  flexCenter: {
    'justify-content': 'center',
  },
  flexBottom: {
    'justify-content': 'flex-end',
  },
});

type Props = {
  classes: Object,
};

@inject('Analytics')
@observer
class Performance extends React.Component<Props, State> {
  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        <Grid container>
          <Grid item xs={8} sm={8} md={8} className={classes.marginRight}>
            <TotalAssetsValue />
          </Grid>

          <Grid item xs={3} sm={3} md={3}>
            <SummaryPerformanceCard />
          </Grid>
        </Grid>
        <Grid container className={classes.marginTop}>
          <Grid item xs={12} sm={12} md={12}>
            <SharePriceChart
              sharePriceOnly={false}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Performance);
