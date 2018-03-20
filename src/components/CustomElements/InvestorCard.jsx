import React from "react";
import { withStyles, Button } from "material-ui";
import PropTypes from "prop-types";

import Paper from "material-ui/Paper";

import buttonStyle from "../../variables/styles/buttonStyle";
import "./CustomStyles/InvestorCard.css";

function InvestorCard({ ...props }) {
  const {
    classes,
    headerText,
    labelText,
    color,
    round,
    children,
    fullWidth,
    disabled,
    ...rest
  } = props;
  return (
    <Button className={classes.investorCard}>
      <Paper className={classes.investorCardPaper}>
        <h4 className="headingText">{headerText}</h4>
        <p className="labelText">{labelText}</p>
      </Paper>
    </Button>
  );
}

InvestorCard.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose",
    "white",
    "simple",
    "transparent"
  ]),
  round: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool
};

export default withStyles(buttonStyle)(InvestorCard);
