import React from "react";
import { withStyles } from "material-ui";

import Paper from "material-ui/Paper";

import buttonStyle from "../../variables/styles/buttonStyle";
import "./CustomStyles/InvestorCard.css";

function InvestorCard({ ...props }) {
  const { classes, headerText, labelText } = props;
  return (
    <Paper className={classes.investorCardPaper}>
      <h4 className="headingText">{headerText}</h4>
      <p className="labelText">{labelText}</p>
    </Paper>
  );
}

export default withStyles(buttonStyle)(InvestorCard);
