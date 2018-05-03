import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid } from 'material-ui';
import Paper from 'material-ui/Paper';
import { inject, observer } from 'mobx-react';


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


const TotalInvestors = inject('PortfolioStore')(observer(({ ...props }) => {
  const { classes, PortfolioStore } = props;

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <Paper className={classes.paper}>
          <h4 className={`headingText ${classes.title}`}>{PortfolioStore.currentPortfolioInvestorsCount}</h4>
          <p className="labelText">Total Investors</p>
        </Paper>
      </Grid >
    </Grid >
  );
}));

TotalInvestors.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TotalInvestors);
