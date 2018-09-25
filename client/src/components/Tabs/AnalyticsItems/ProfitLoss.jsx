import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import Button from '../../CustomButtons/Button';
import SelectBenchmark from '../../Selectors/Analytics/SelectBenchmark';
import SelectPeriod from '../../Selectors/SelectPeriod';
import ProfitLossChart from '../../HighCharts/ProfitLoss';
import ProfitLossTable from '../../CustomTables/ProfitLossTable';
import SelectBaseCurrency from '../../Selectors/SelectBaseCurrency';
import ProfitLossGlobalChart from '../../HighCharts/ProfitLossGlobalChart';

const styles = () => ({
  overflowNone: {
    'overflow-x': 'hidden'
  },
  marginTop: {
    marginTop: '40px',
  },
  marginRight: {
    marginRight: '75px',
  },
  topItem: {
    height: 'auto',
    paddingBottom: '20px'
  },
  leftTopItem: {
    'padding-right': '50px',
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
  bigTopPadding: {
    marginTop: '40px'
  },
  header: {
    color: 'red',
    margin: '20px 0',
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
  paddingLeft: {
    paddingLeft: '20px'
  },
  paddingRight: {
    paddingRight: '20px'
  },
  noMargin: {
    marginTop: 0
  }
});

type Props = {
  classes: Object,
};

@inject('MarketStore', 'InvestorStore')
@observer
class ProfitLoss extends React.Component<Props, State> {
  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.overflowNone}>
        <Grid container>
          <Paper className={[classes.maxWidth, classes.padding].join(' ')}>
            <ProfitLossGlobalChart />
          </Paper>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Grid item xs={3} className={[classes.marginRight, classes.flex, classes.flexCenter].join(' ')}>
            <SelectPeriod />
          </Grid>

          <Grid item xs={3} className={[classes.marginRight, classes.flex, classes.flexCenter].join(' ')}>
            <SelectBaseCurrency
              className={classes.inputWrapper}
              label="Select currency"
              validators={['isPositive']}
              style={{ textTransform: 'uppercase', fontSize: '14px' }}
            />
          </Grid>

          <Grid item xs={1} className={[classes.flex, classes.flexBottom].join(' ')}>
            <Button>Apply</Button>
          </Grid>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Paper className={[classes.maxWidth, classes.padding].join(' ')}>
            <ProfitLossChart />
          </Paper>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Grid item xs={6} className={[classes.paddingRight].join(' ')}>
            <Paper>
              <ProfitLossTable asc={true} />
            </Paper>
          </Grid>
          <Grid item xs={6} className={[classes.paddingLeft].join(' ')}>
            <Paper>
              <ProfitLossTable asc={false} />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }
};

export default withStyles(styles)(ProfitLoss);