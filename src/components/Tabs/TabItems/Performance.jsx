import React from "react";
import Paper from "material-ui/Paper";
import { Grid } from "material-ui";

import RegularButton from "../../CustomButtons/Button";
import SelectPeriod from "../../Selectors/SelectPeriod";
// import InvestorPieChart from "../../HighCharts/InvestorPie";

import "./TabStyles/Volatility.css";

class Performance extends React.Component {
  state = {
    open: false
  };

  render() {
    return (
      <div className="hideOverflowV">
        <Grid container className="VolatilityGrid">
          <Grid container>
            <Grid item xs={3}>
              <SelectPeriod />
            </Grid>

            <Grid item xs={3}>
              <RegularButton>Apply</RegularButton>
            </Grid>
          </Grid>
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
        
      </div>
    );
  }
}

export default Performance;
