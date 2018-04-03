import React from "react";
import Paper from "material-ui/Paper";
import { Grid } from "material-ui";

import RegularButton from "../../CustomButtons/Button";
import SelectBenchmark from "../../Selectors/SelectBenchmark";
// import InvestorPieChart from "../../HighCharts/InvestorPie";
import PerformanceTable from "../../CustomTables/PerformanceTable";
import "./TabStyles/Performance.css";
// import PerformanceChart from '../../HighCharts/PerformanceChart';

class Performance extends React.Component {
  state = {
    open: false
  };

  render() {
    return (
      <div className="hideOverflow">
        <Grid container className="PerformanceGrid">
          <Grid container>
            <Grid item xs={3}>
              <SelectBenchmark />
            </Grid>

            <Grid item xs={3}>
              <RegularButton>Apply</RegularButton>
            </Grid>
          </Grid>
        </Grid>

        <br />
        <Grid container className="VolatilityGrid">
          <Grid item xs={12}>
            <Paper className="PerformancePaper">
              {/* <PerformanceChart /> */}
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <PerformanceTable />
        </Grid>

        <br />
      </div>
    );
  }
}

export default Performance;
