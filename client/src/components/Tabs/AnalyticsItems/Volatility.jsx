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
  marginTop: {
    marginTop: '40px',
  },
  marginRight: {
    marginRight: '75px',
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
  }
});

type Props = {
  classes: Object,
};

const Volatility = inject('Analytics')(observer(({ ...props }: Props) => {
  const { classes, Analytics } = props;

  return (
    <Grid container>
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

      <Grid container>
        <Grid item xs={8}>
          <VolatilityTable style={{ width: '100%' }} />
        </Grid>

        <Grid item xs={4}>
          <Paper>
            <VolatilitySpider style={{ width: '100%' }} />
          </Paper>
        </Grid>
      </Grid>

      <Grid container>
        <Paper className="VolatilityPaper">
          <h5>PORTFOLIO VOLATILITY AND RISK</h5>

          <Grid container>
            <Grid item xs={3}><p>STANDARD DEVIATION: <b>2.63</b></p></Grid>
            <Grid item xs={3}><p>PORTFOLIO ALPHA: <b>2.14%</b></p></Grid>
            <Grid item xs={3}><p>PORTFOLIO BETA: <b>0.65%</b></p></Grid>
            <Grid item xs={3}><p>PORTFOLIO VARIANCE: <b>0.65</b></p></Grid>
          </Grid>

          <VolatilityAndRisk />
        </Paper>
      </Grid>

      <Grid container>
        <Paper>
          <VolatilityColumnChart />
        </Paper>
      </Grid>
    </Grid>
  );
}));

export default withStyles(styles)(Volatility);