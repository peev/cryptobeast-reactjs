// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';

const style = {
  grid: {
    padding: '0 15px !important',
  },
};

type Props = {
  classes: Object,
  children: React.Node,
  // rest: Object,
};

function ItemGrid({ ...props }: Props) {
  const { classes, children, ...rest } = props;
  return (
    <Grid item {...rest} className={classes.grid}>
      {children}
    </Grid>
  );
}

export default withStyles(style)(ItemGrid);
