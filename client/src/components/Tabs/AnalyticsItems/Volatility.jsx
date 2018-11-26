// @flow
import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles, Grid } from '@material-ui/core';

import SelectBenchmark from '../../Selectors/Analytics/SelectBenchmark';
import MotionSelect from '../../Selectors/MotionSelect';
import VolatilityColumnChart from '../../HighCharts/VolatilityDevSkew';
import VolatilityAndRisk from '../../HighCharts/VolatilityAndRisk';
import VolatilityTable from '../../CustomTables/VolatilityTable';
import VolatilitySpider from '../../HighCharts/VolatilitySpider';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  overflowNone: {
    'overflow-x': 'hidden',
  },
  marginTop: {
    marginTop: '40px',
  },
  marginRight: {
    marginRight: '75px',
  },
  topItem: {
    height: 'auto',
    paddingBottom: '20px',
  },
  leftTopItem: {
    'padding-right': '50px',
  },
  topHeight: {
    height: '100%',
  },
  maxWidth: {
    width: '100%',
    'overflow-x': 'hidden',
  },
  smallTopPadding: {
    marginTop: '20px',
  },
  bigTopPadding: {
    marginTop: '40px',
  },
  header: {
    color: '#ca3f58',
    margin: '20px 0',
  },
  flex: {
    display: 'flex',
    'flex-direction': 'column',
    'text-align': 'center',
  },
  flexCenter: {
    'justify-content': 'center',
  },
  flexBottom: {
    'justify-content': 'flex-end',
  },
  padding: {
    padding: '20px',
  },
  noMargin: {
    marginTop: 0,
  },
});

type Props = {
  classes: Object,
};

class Volatility extends React.Component<Props, State> {
  constructor(props: Object) {
    super(props);
    this.handleSelectPeriod = this.handleSelectPeriod.bind(this);
    this.handleSelectedCurrency = this.handleSelectedCurrency.bind(this);
  }

  handleSelectPeriod(data: string) {
    if (!data) {
      return;
    }
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      selectPeriod: data,
    });
  }

  handleSelectedCurrency(data: string) {
    if (!data) {
      return;
    }
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      selectedCurrency: data,
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.root}>
        <Grid item xs={7} className={[classes.topItem, classes.topHeight, classes.leftTopItem].join(' ')}>
          <Grid container spacing={24}>
            <Grid item xs={4}>
              <MotionSelect defaultValueIndex={0} selectedValue={this.handleSelectPeriod} values={['30 days', '60 days']} />
            </Grid>
            <Grid item xs={4}>
              <SelectBenchmark />
            </Grid>
            <Grid item xs={4}>
              <MotionSelect defaultValueIndex={0} className={classes.padding} selectedValue={this.handleSelectedCurrency} values={['ETH', 'USD']} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5} className={[classes.topItem, classes.topHeight].join(' ')} />

        <Grid container className={classes.smallTopPadding}>
          <Grid item xs={7} className={[classes.topItem, classes.topHeight, classes.leftTopItem].join(' ')}>
            <Paper className={classes.topHeight}>
              <VolatilityTable style={{ width: '100%' }} className={[classes.flex, classes.flexCenter].join(' ')} />
            </Paper>
          </Grid>

          <Grid item xs={5} className={[classes.topItem, classes.topHeight].join(' ')}>
            <Paper className={classes.padding}>
              <VolatilitySpider style={{ width: '100%' }} />
            </Paper>
          </Grid>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Paper className={['VolatilityPaper', classes.maxWidth, classes.padding].join(' ')}>
            <h5 className={classes.noMargin}>PORTFOLIO VOLATILITY AND RISK</h5>

            <Grid container>
              <Grid item xs={3}><p>STANDARD DEVIATION: <b>2.63</b></p></Grid>
              <Grid item xs={3}><p>PORTFOLIO ALPHA: <b>2.14%</b></p></Grid>
              <Grid item xs={3}><p>PORTFOLIO BETA: <b>0.65%</b></p></Grid>
              <Grid item xs={3}><p>PORTFOLIO VARIANCE: <b>0.65</b></p></Grid>
            </Grid>

            <VolatilityAndRisk />
          </Paper>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Paper className={[classes.maxWidth, classes.padding].join(' ')}>
            <VolatilityColumnChart />
          </Paper>
        </Grid>
      </Grid >
    );
  }
};

export default withStyles(styles)(Volatility);