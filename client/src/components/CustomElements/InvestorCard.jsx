// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';

import buttonStyle from './../../variables/styles/buttonStyle';
import './CustomStyles/InvestorCard.css';

type Props = {
  classes: Object,
  headerText: string,
  labelText: string,
};

function InvestorCard({ ...props }: Props) {
  const { classes, headerText, labelText } = props;
  return (
    <Paper className={classes.investorCardPaper}>
      <h4 className="headingText">{headerText}</h4>
      <p className="labelText">{labelText}</p>
    </Paper>
  );
}

export default withStyles(buttonStyle)(InvestorCard);
