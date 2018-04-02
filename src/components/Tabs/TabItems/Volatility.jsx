import React from "react";
import Paper from "material-ui/Paper";
import { Grid } from "material-ui";

import RegularButton from "../../CustomButtons/Button";
import SelectBenchmark from "../../Selectors/SelectBenchmark";
import SelectPeriod from "../../Selectors/SelectPeriod";
import VolatilityColumnChart from "../../HighCharts/VolatilityDevSkew";
// import InvestorPieChart from "../../HighCharts/InvestorPie";

import "./TabStyles/Volatility.css";
import VolatilityTable from "../../CustomTables/VolatilityTable";

class Volatility extends React.Component {
  state = {
    open: false
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

              <Grid item xs={3}>
                <RegularButton>Apply</RegularButton>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <br />
        <Grid container className="VolatilityGrid">
          <Grid item xs={8}>
            <VolatilityTable style={{ width: "100%" }} />
          </Grid>
          <Grid item xs={4}>
            <Paper className="VolatilityPaper">
              <div> </div>
            </Paper>
          </Grid>
        </Grid>
        <br />
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
