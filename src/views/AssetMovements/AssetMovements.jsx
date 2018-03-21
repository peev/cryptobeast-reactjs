import React from "react";
import { Grid } from "material-ui";
import Paper from "material-ui/Paper";
import { TextField } from "material-ui";
import RegularButton from "../../components/CustomButtons/Button";
import SelectCurrency from "../../components/Selectors/SelectCurrency";
import SelectExchange from "../../components/Selectors/SelectExchange";
// import classes from './AssetMovements.css';
import "./AssetMovements.css";

class AssetMovements extends React.Component {
  state = {
    direction: "row"
  };
  render() {
    return (
      <div>
        <Grid container className="AMGrid">
          <Paper className="AMPaper">
            <Grid container>
              <h4>BASIC ASSET INPUT</h4>
            </Grid>

            <Grid container>
              <Grid item xs={3}>
                <SelectCurrency />
                <TextField placeholder="QUANTITY..." />
              </Grid>
              <Grid item xs={3}>
                <SelectExchange />
              </Grid>
            </Grid>
            <br />
            <RegularButton color="primary">ADD</RegularButton>
          </Paper>
        </Grid>
        <br />
        <Grid container className="AMGrid">
          <Paper className="AMPaper">
            <Grid container>
              <h4>ASSET ALLOCATION</h4>
            </Grid>

            <Grid container>
              <Grid item xs={3}>
                <SelectCurrency />
                <TextField placeholder="QUANTITY..." />
              </Grid>
              <Grid item xs={3}>
                <SelectExchange />

                <TextField placeholder="QUANTITY..." />
              </Grid>
              <Grid item xs={3}>
                <SelectCurrency />
                <TextField placeholder="QUANTITY..." />
              </Grid>
              <Grid item xs={3}>
                <SelectExchange />
                <TextField placeholder="QUANTITY..." />
              </Grid>
            </Grid>
            <br />
            <RegularButton color="primary">RECORD</RegularButton>
          </Paper>
        </Grid>
      </div>
    );
  }
}

export default AssetMovements;
