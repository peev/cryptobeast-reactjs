import React from 'react';
import Paper from 'material-ui/Paper';
import { Grid } from 'material-ui';

import RegularButton from '../../CustomButtons/Button';
import SelectBenchmark from '../../Selectors/SelectBenchmark';
import SelectPeriod from '../../Selectors/SelectPeriod';
import VolatilityColumnChart from '../../HighCharts/VolatilityDevSkew';
// import InvestorPieChart from "../../HighCharts/InvestorPie";
import VolatilityAndRisk from '../../HighCharts/VolatilityAndRisk';
import './AnalyticsStyles/Volatility.css';
import VolatilityTable from '../../CustomTables/VolatilityTable';
import VolatilitySpider from '../../HighCharts/VolatilitySpider';


class Volatility extends React.Component {
  state = {
    open: false,
  };

  render() {
    return (
      <div className="hideOverflowV">
        <Grid container className="VolatilityGrid">
          <Paper className="VolatilityPaper">
            <Grid container>
              <Grid item xs={3}>
                <SelectPeriod />
              </Grid>

              <Grid item xs={3}>
                <SelectBenchmark />
              </Grid>

              <Grid item xs={6}>
                <RegularButton>Apply</RegularButton>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <br />
        <Grid container className="VolatilityGrid">
          <Grid item xs={8}>
            <VolatilityTable style={{ width: '100%' }} />
          </Grid>
          <Grid item xs={4}>
            <Paper className="VolatilityPaper">
              <VolatilitySpider style={{ width: '100%' }} />
            </Paper>
          </Grid>
        </Grid>
        <br />
        <Grid container className="VolatilityGrid">
          <Paper className="VolatilityPaper">
            <h5>PORTFOLIO VOLATILITY AND RISK</h5>
            <br />
            <Grid container className="VolatilityGrid">
              <Grid item xs={3}><p>STANDARD DEVIATION: <b>2.63</b></p></Grid>
              <Grid item xs={3}><p>PORTFOLIO ALPHA: <b>2.14%</b></p></Grid>
              <Grid item xs={3}><p>PORTFOLIO BETA: <b>0.65%</b></p></Grid>
              <Grid item xs={3}><p>PORTFOLIO VARIANCE: <b>0.65</b></p></Grid>
            </Grid>
            <br />
            <VolatilityAndRisk />
          </Paper>
        </Grid>
        <Grid container className="VolatilityGrid">
          <Paper className="VolatilityPaper">
            <VolatilityColumnChart />
          </Paper>
        </Grid>
      </div>
    );
  }
}

export default Volatility;
