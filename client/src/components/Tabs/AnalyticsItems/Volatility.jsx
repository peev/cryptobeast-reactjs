import React from 'react';
import Paper from 'material-ui/Paper';
import { Grid } from 'material-ui';

import Button from '../../CustomButtons/Button';
import SelectBenchmark from '../../Selectors/Analytics/SelectBenchmark';
import SelectPeriod from '../../Selectors/SelectPeriod';
import VolatilityColumnChart from '../../HighCharts/VolatilityDevSkew';
import VolatilityAndRisk from '../../HighCharts/VolatilityAndRisk';
import VolatilityTable from '../../CustomTables/VolatilityTable';
import VolatilitySpider from '../../HighCharts/VolatilitySpider';


const Volatility = () => { // eslint-disable-line
  return (
    <Grid container>
      <Grid container>
        <Grid item xs={3}>
          <SelectPeriod />
        </Grid>

        <Grid item xs={3}>
          <SelectBenchmark />
        </Grid>

        <Grid item xs={1}>
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
};

export default Volatility;
