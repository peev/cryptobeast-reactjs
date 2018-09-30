import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles, Grid } from '@material-ui/core';

import LiquidityChart from '../../HighCharts/Liquidity';
import SelectBenchmark from '../../Selectors/Analytics/SelectBenchmark';

const styles = () => ({
  overflowNone: {
    'overflow-x': 'hidden'
  },
  marginTop: {
    marginTop: '40px',
  },
  marginRight: {
    marginRight: '75px',
  },
  topItem: {
    height: 'auto',
    paddingBottom: '20px'
  },
  leftTopItem: {
    'padding-right': '50px',
  },
  topHeight: {
    height: '100%',
  },
  maxWidth: {
    width: '100%',
    'overflow-x': 'hidden'
  },
  smallTopPadding: {
    marginTop: '20px'
  },
  bigTopPadding: {
    marginTop: '40px'
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
    'justify-content': 'center'
  },
  flexBottom: {
    'justify-content': 'flex-end'
  },
  padding: {
    padding: '20px'
  },
  noMargin: {
    marginTop: 0
  }
});

type Props = {
  classes: Object,
};

class Liquidity extends React.Component<Props, State> {
  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.overflowNone}>
        <Grid container>
          <Grid item xs={3} className={[classes.marginRight, classes.flex, classes.flexCenter].join(' ')}>
            <SelectBenchmark/>
          </Grid>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Paper className={[classes.maxWidth, classes.padding].join(' ')}>
            <LiquidityChart />
          </Paper>
        </Grid>
      </Grid>
    );
  }
};

export default withStyles(styles)(Liquidity);