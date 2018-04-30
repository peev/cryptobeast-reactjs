import React from 'react';
import Paper from 'material-ui/Paper';
import { Grid } from 'material-ui';

import RegularButton from '../../CustomButtons/Button';
import SelectBenchmark from '../../Selectors/SelectBenchmark';
// import InvestorPieChart from "../../HighCharts/InvestorPie";
import PerformanceTable from '../../CustomTables/PerformanceTable';
import './AnalyticsStyles/Performance.css';
import PerformanceChart from '../../HighCharts/PerformanceChart';


class Performance extends React.Component {
  state = {
    open: false,
  };

  render() {
    return (
      <div className="hideOverflow">
        <Grid container className="PerformanceGrid">
          <Grid container>
            <Grid item xs={3} className="align" >
              <SelectBenchmark />
            </Grid>

            <Grid item xs={3}>
              <RegularButton>Apply</RegularButton>
            </Grid>
          </Grid>
        </Grid>

        <br />
        <Grid container className="PerformanceGrid">
          <Grid item xs={12}>
            <Paper className="PerformancePaper">
              <PerformanceChart className="PerformancePaperChart" />
            </Paper>
          </Grid>
        </Grid>
        <Grid container className="PerformanceGrid">
          <Grid item xs={12}>
            <Paper className="PerformancePaper">
              <PerformanceTable />
              <RegularButton>Export</RegularButton>
              <br />

            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Performance;
