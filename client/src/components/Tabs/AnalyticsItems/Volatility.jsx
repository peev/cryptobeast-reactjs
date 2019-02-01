/* eslint-disable react/no-unused-state */
// @flow
import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import MotionSelect from '../../Selectors/MotionSelect';
import VolatilityColumnChart from '../../HighCharts/VolatilityDevSkew';
import VolatilityTable from '../../CustomTables/VolatilityTable';
import VolatilityRiskCard from '../../Cards/Analytics/VolatilityRiskCard';

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
  PortfolioStore: Object,
  Analytics: Object,
};

type State = {
  selectPeriod: number,
  selectedBenchmark: string,
  selectedCurrency: string,
};

@inject('PortfolioStore', 'Analytics')
@observer
class Volatility extends React.Component<Props, State> {
  constructor(props: Object) {
    super(props);
    this.state = {
      selectPeriod: 30,
      selectBenchmark: 'ETH',
    };
  }

  componentDidMount() {
    this.props.PortfolioStore.setStandardDeviationPeriod(this.state.selectPeriod);
    this.props.PortfolioStore.getAlphaData(this.state.selectPeriod, this.state.selectBenchmark);
  }

  componentWillUpdate(nextProps: object, nextState: object) {
    if (nextState.selectPeriod !== this.state.selectPeriod) {
      this.props.PortfolioStore.setStandardDeviationPeriod(nextState.selectPeriod);
    }
    if (nextState.selectBenchmark !== this.state.selectBenchmark) {
      this.props.PortfolioStore.getAlphaData(nextState.selectPeriod, nextState.selectBenchmark);
    }
  }

  handleSelectPeriod = (data: string) => {
    if (!data) {
      return;
    }
    this.props.Analytics.riskPeriod = Number(data.split(' ')[0]);
    this.setState({
      selectPeriod: Number(data.split(' ')[0]),
    });
  }

  handleSelectedBenchmark = (data: string) => {
    if (!data) {
      return;
    }
    // eslint-disable-next-line prefer-destructuring
    this.props.Analytics.riskBenchmark = data.split(' ')[0];
    this.setState({
      selectBenchmark: data.split(' ')[0],
    });
  }

  handleSelectedCurrency = (data: string) => {
    if (!data) {
      return;
    }
    this.props.Analytics.riskCurrency = data;
    this.setState({
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
              <MotionSelect defaultValueIndex={0} title="Select period" selectedValue={this.handleSelectPeriod} values={['30 days', '7 days']} />
            </Grid>
            <Grid item xs={4}>
              <MotionSelect defaultValueIndex={0} title="Select benchmark" selectedValue={this.handleSelectedBenchmark} values={['ETH price']} />
            </Grid>
            <Grid item xs={4}>
              <MotionSelect defaultValueIndex={0} title="Select currency" className={classes.padding} selectedValue={this.handleSelectedCurrency} values={['USD', 'ETH']} />
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
            <VolatilityRiskCard style={{ width: '100%' }} />
          </Grid>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Paper className={[classes.maxWidth, classes.padding].join(' ')}>
            <VolatilityColumnChart />
          </Paper>
        </Grid>
      </Grid >
    );
  }
}

export default withStyles(styles)(Volatility);
