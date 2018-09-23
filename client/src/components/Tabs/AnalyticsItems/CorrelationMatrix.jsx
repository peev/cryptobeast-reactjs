import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import Button from '../../CustomButtons/Button';
import SelectBenchmark from '../../Selectors/Analytics/SelectBenchmark';
import SelectPeriod from '../../Selectors/SelectPeriod';
import CorrelationMatrixTable from '../../CustomTables/CorrelationMatrixTable';

const styles = () => ({
  overflowNone: {
    'overflow-x': 'hidden'
  },
  marginRight: {
    marginRight: '75px',
  },
  marginTop: {
    marginTop: '40px',
  },
  topHeight: {
    height: '100%',
  },
  maxWidth: {
    width: '100%',
    'overflow-x': 'hidden'
  },
  smallTopPadding: {
    marginTop: '20px'
  },
  flex: {
    display: 'flex',
    'flex-direction': 'column',
    'text-align': 'center',
  },
  flexCenter: {
    'justify-content': 'center'
  },
  flexBottom: {
    'justify-content': 'flex-end'
  },
  padding: {
    padding: '20px'
  },
  noMargin: {
    marginTop: 0
  }
});

type Props = {
  classes: Object,
};

const CorrelationMatrix = inject('Analytics')(observer(({ ...props }: Props) => {
  const { classes } = props;

  return (
    <Grid container className={classes.overflowNone}>
      <Grid container>
        <Grid item xs={3} className={[classes.marginRight, classes.flex, classes.flexCenter].join(' ')}>
          <SelectPeriod />
        </Grid>

        <Grid item xs={3} className={[classes.marginRight, classes.flex, classes.flexCenter].join(' ')}>
          <SelectBenchmark />
        </Grid>

        <Grid item xs={1} className={[classes.flex, classes.flexBottom].join(' ')}>
          <Button>Apply</Button>
        </Grid>
      </Grid>

      <Grid container className={classes.smallTopPadding}>
        <Grid item className={[classes.topItem, classes.topHeight, classes.maxWidth].join(' ')}>
          <Paper className={classes.topHeight}>
            <CorrelationMatrixTable style={{ width: '100%' }} className={[classes.flex, classes.flexCenter].join(' ')} />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}));

export default withStyles(styles)(CorrelationMatrix);