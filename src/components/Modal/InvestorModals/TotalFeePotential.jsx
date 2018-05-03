import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid } from 'material-ui';
import { inject, observer } from 'mobx-react';
import Paper from 'material-ui/Paper';


const styles = () => ({
  paper: {
    boxSizing: 'border-box',
    width: '200px',
    padding: '8px 20px',
    margin: '2px auto',
    backgroundColor: '#22252F',
    textTransform: 'uppercase',
    boxShadow: 'none',
  },
  title: {
    fontSize: '16px',
  },
});

const TotalFeePotential = inject('InvestorStore')(observer(({ ...props }) => {
  const { classes, InvestorStore } = props;

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <Paper className={classes.paper}>
          <h4 className={`headingText ${classes.title}`}>{`$${InvestorStore.totalFeePotential}`}</h4>
          <p className="labelText">Total Fee Potential</p>
        </Paper>
      </Grid >
    </Grid >
  );
}));

TotalFeePotential.propTypes = {
  classes: PropTypes.object.isRequired,
  InvestorStore: PropTypes.object,
};

export default withStyles(styles)(TotalFeePotential);
