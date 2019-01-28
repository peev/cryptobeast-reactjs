// @flow
import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

// import SelectBenchmark from '../../Selectors/Analytics/SelectBenchmark';
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
  // constructor(props: Object) {
  //   super(props);
  //   this.handleSelectPeriod = this.handleSelectPeriod.bind(this);
  // }

  // handleSelectPeriod = (data: Object) => {
  //   if (!data) {
  //     return;
  //   }

  // };

  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        {/* <Grid container className={classes.header}>
          <Grid item xs={2} sm={2} md={2} className={[classes.marginRight, classes.flex, classes.flexCenter].join(' ')}>
            <MotionSelect defaultValueIndex={0} selectedValue={this.handleSelectPeriod} values={['1d', '1w', '1m']} />
          </Grid>
        </Grid> */}

        <Grid container>
          <Grid item xs={8} sm={8} md={8} className={classes.marginRight}>
            <TotalAssetsValue />
          </Grid>

          <Grid item xs={3} sm={3} md={3}>
            <SummaryPerformanceCard />
          </Grid>
        </Grid>

        {/* <Grid container>
          <Grid item xs={2} sm={2} md={2} className={[classes.marginRight, classes.flex, classes.flexCenter].join(' ')}>
            <SelectBenchmark />
          </Grid>
        </Grid> */}

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
