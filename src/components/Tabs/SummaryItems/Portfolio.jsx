import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid } from 'material-ui';
import PerformanceChart from '../../HighCharts/PerformanceChart';

const styles = () => ({
  container: {
    margin: '0',
    height: '100%',
    width: '100%',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  gridItem: {
    width: '100%',
    height: '100%',
    margin: '0',
    padding: '0 !important',
  },
});

const Portfolio = (props) => {
  const { classes } = props;

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} sm={12} md={12} className={classes.gridItem}>
        <PerformanceChart />
      </Grid>
    </Grid >
  );
};

Portfolio.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Portfolio);
