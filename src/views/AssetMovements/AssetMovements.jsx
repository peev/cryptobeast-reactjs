import React from "react";
import { Grid, TextField } from "material-ui";
import Paper from "material-ui/Paper";
import classes from "./AssetMovements.css";
import RegularButton from "../../components/CustomButtons/Button";
import SelectCurrency from "../../components/Selectors/SelectCurrency";
import SelectExchange from "../../components/Selectors/SelectExchange";
import Textarea from "material-ui/Input/Textarea";

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
              <h4>Record Manual Transaction</h4>
            </Grid>

            <Grid container>
              <Grid item xs={3}>
                <SelectExchange />
                <SelectExchange />
              </Grid>
              <Grid item xs={3}>
                <SelectCurrency />
                <Textarea placeholder="QUANTITY..." />
              </Grid>
              <Grid item xs={3}>
                <SelectCurrency />
                <Textarea placeholder="QUANTITY..." />
              </Grid>
              <Grid item xs={3}>
                <SelectCurrency />
                <Textarea placeholder="QUANTITY..." />
              </Grid>
            </Grid>
            <RegularButton color="primary">Export</RegularButton>
          </Paper>
        </Grid>
      </div>
    );
  }
}

export default AssetMovements;
