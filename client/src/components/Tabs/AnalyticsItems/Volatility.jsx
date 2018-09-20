import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import Button from '../../CustomButtons/Button';
import SelectBenchmark from '../../Selectors/Analytics/SelectBenchmark';
import SelectPeriod from '../../Selectors/SelectPeriod';
import VolatilityColumnChart from '../../HighCharts/VolatilityDevSkew';
import VolatilityAndRisk from '../../HighCharts/VolatilityAndRisk';
import VolatilityTable from '../../CustomTables/VolatilityTable';
import VolatilitySpider from '../../HighCharts/VolatilitySpider';

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
    color: 'red',
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

const Volatility = inject('Analytics')(observer(({ ...props }: Props) => {
  const { classes, Analytics } = props;

  return (
    <Grid container className={classes.overflowNone}>
      <Grid container>
        <Grid item xs={3} className={[classes.marginRight, classes.flex, classes.flexCenter].join(' ')}>
          <SelectPeriod />
        </Grid>

        <Grid item xs={3} className={[classes.marginRight, classes.flex, classes.flexCenter].join(' ')}>
          <SelectBenchmark />
        </Grid>

        <Grid item xs={1} className={[classes.flex, classes.flexBottom].join(' ')}>
          <Button>Apply</Button>
        </Grid>
      </Grid>

      <Grid container className={classes.smallTopPadding}>
        <Grid item xs={7} className={[classes.topItem, classes.topHeight, classes.leftTopItem].join(' ')}>
          <Paper className={classes.topHeight}>
            <VolatilityTable style={{ width: '100%' }}  className={[classes.flex, classes.flexCenter].join(' ')} />
          </Paper>
        </Grid>

        <Grid item xs={5} className={[classes.topItem, classes.topHeight].join(' ')}>
          <Paper className={classes.padding}>
            <VolatilitySpider style={{ width: '100%' }} />
          </Paper>
        </Grid>
      </Grid>

      <Grid container className={classes.bigTopPadding}>
        <Paper className="VolatilityPaper" className={[classes.maxWidth, classes.padding].join(' ')}>
          <h5 className={classes.noMargin}>PORTFOLIO VOLATILITY AND RISK</h5>

          <Grid container>
            <Grid item xs={3}><p>STANDARD DEVIATION: <b>2.63</b></p></Grid>
            <Grid item xs={3}><p>PORTFOLIO ALPHA: <b>2.14%</b></p></Grid>
            <Grid item xs={3}><p>PORTFOLIO BETA: <b>0.65%</b></p></Grid>
            <Grid item xs={3}><p>PORTFOLIO VARIANCE: <b>0.65</b></p></Grid>
          </Grid>

          <VolatilityAndRisk />
        </Paper>
      </Grid>

      <Grid container className={classes.bigTopPadding}>
        <Paper className={[classes.maxWidth, classes.padding].join(' ')}>
          <VolatilityColumnChart />
        </Paper>
      </Grid>
    </Grid>
  );
}));

export default withStyles(styles)(Volatility);