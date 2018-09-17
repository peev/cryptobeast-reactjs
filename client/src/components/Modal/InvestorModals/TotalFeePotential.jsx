// @flow
import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import Paper from '@material-ui/core/Paper';


const styles = () => ({
  paper: {
    boxSizing: 'border-box',
    // width: '100%',
    padding: '12px',
    backgroundColor: '#fff',
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0, 0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    textTransform: 'uppercase',
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
  InvestorStore: Object,
};

const TotalFeePotential = inject('InvestorStore')(observer(({ ...props }: Props) => {
  const { classes, InvestorStore } = props;

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <Paper className={classes.paper}>
          <h4 className={`headingText ${classes.title}`}>{`$${InvestorStore.totalFeePotential}`}</h4>
          <p className={`labelText ${classes.label}`} > Total Fee Potential</p>
        </Paper>
      </Grid >
    </Grid >
  );
}));

export default withStyles(styles)(TotalFeePotential);
