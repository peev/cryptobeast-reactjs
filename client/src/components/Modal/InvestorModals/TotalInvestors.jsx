// @flow
import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { inject, observer } from 'mobx-react';


const styles = () => ({
  paper: {
    boxSizing: 'border-box',
    // width: '100%',
    padding: '12px',
    textTransform: 'uppercase',
    backgroundColor: '#fff',
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0, 0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#000',
  },
  label: {
    color: '#000',
    fontSize: '13.3px',
  },
});

type Props = {
  classes: Object,
};

const TotalInvestors = inject('PortfolioStore')(observer(({ ...props }: Props) => {
  const { classes, PortfolioStore } = props;

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <Paper className={classes.paper}>
          <h4 className={`headingText ${classes.title}`}>{PortfolioStore.currentPortfolioInvestorsCount}</h4>
          <p className={`labelText ${classes.label}`}>Total Investors</p>
        </Paper>
      </Grid >
    </Grid >
  );
}));

export default withStyles(styles)(TotalInvestors);
