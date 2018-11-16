/* eslint-disable class-methods-use-this */
// @flow
import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import MotionSelect from '../../Selectors/MotionSelect';
import ProfitLossChart from '../../HighCharts/ProfitLoss';
import ProfitLossGlobalChart from '../../HighCharts/ProfitLossGlobalChart';

const styles = () => ({
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
  paddingLeft: {
    paddingLeft: '20px',
  },
  paddingRight: {
    paddingRight: '20px',
  },
  noMargin: {
    marginTop: 0,
  },
  textLeft: {
    textAlign: 'left',
  },
});

type Props = {
  AssetStore: Object,
  CurrencyStore: Object,
  classes: Object,
};

@inject('MarketStore', 'AssetStore', 'CurrencyStore')
@observer
class ProfitLoss extends React.Component<Props, State> {
  componentDidMount() {
    this.props.AssetStore.getAssetHistoryByTokenIdAndPeriod(this.state.selectedCurrency, this.state.selectPeriod);
  }

  componentWillUpdate(nextProps: object, nextState: object) {
    if (nextState.selectedCurrency !== this.state.selectedCurrency || nextState.selectPeriod !== this.state.selectPeriod) {
      this.props.AssetStore.getAssetHistoryByTokenIdAndPeriod(nextState.selectedCurrency, nextState.selectPeriod);
    }
  }

  state = {
    selectPeriod: 'm',
    globalSelectPeriod: '',
    selectedCurrency: 'ETH',
  };

  constructor(props: Object) {
    super(props);
    this.handleSelectCurrency = this.handleSelectCurrency.bind(this);
    this.handleSelectPeriod = this.handleSelectPeriod.bind(this);
    this.handleGlobalSelectPeriod = this.handleGlobalSelectPeriod.bind(this);
  }

  getPeriodInDays(val: string) {
    let days = 0;
    switch (val) {
      case '1d':
        days = 1;
        break;
      case '1w':
        days = 7;
        break;
      case '1m':
        days = 30;
        break;
      case '1y':
        days = 365;
        break;
      default:
        days = 1;
        break;
    }
    return days;
  }

  handleSelectCurrency(data: string) {
    if (!data) {
      return;
    }
    this.setState({
      selectedCurrency: data,
    });
  }

  handleSelectPeriod(data: string) {
    if (!data) {
      return;
    }
    this.setState({
      selectPeriod: data.substr(1),
    });
  }

  handleGlobalSelectPeriod(data) {
    if (!data) {
      return;
    }
    this.setState({
      globalSelectPeriod: this.getPeriodInDays(data),
    });
  }

  render() {
    const { classes, MarketStore, AssetStore, CurrencyStore } = this.props;
    const { selectPeriod, globalSelectPeriod, selectedCurrency } = this.state;
    const profitLoss = MarketStore.profitLoss;

    const localSelectPeriod = selectPeriod || 30;
    const localGlobalSelectPeriod = globalSelectPeriod || 30;

    const profitLossCurrencies = (CurrencyStore.currencies.length > 0) ? CurrencyStore.currenciesTokenNameAndSymbol : [];
    const defaultIndex = this.props.CurrencyStore.currenciesTokenNameAndSymbol.indexOf('ETH');

    return (
      <Grid container className={classes.overflowNone}>
        <Grid container>
          <Grid item xs={2} className={[classes.flex, classes.flexCenter, classes.textLeft].join(' ')}>
            <MotionSelect defaultValueIndex={0} selectedValue={this.handleGlobalSelectPeriod} values={['1d', '1w', '1m']} />
          </Grid>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Paper className={[classes.maxWidth, classes.padding].join(' ')}>
            <ProfitLossGlobalChart data={profitLoss} days={localGlobalSelectPeriod} />
          </Paper>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Grid item xs={2} className={[classes.flex, classes.flexCenter, classes.textLeft].join(' ')}>
            <MotionSelect defaultValueIndex={1} selectedValue={this.handleSelectPeriod} values={['1w', '1m', '1y']} />
          </Grid>
          <Grid item xs={2} className={[classes.paddingLeft, classes.flex, classes.flexCenter, classes.textLeft].join(' ')}>
            <MotionSelect defaultValueIndex={defaultIndex} selectedValue={this.handleSelectCurrency} values={profitLossCurrencies} title="Select currency" />
          </Grid>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Paper className={[classes.maxWidth, classes.padding].join(' ')}>
            <ProfitLossChart currency={selectedCurrency} chartData={AssetStore.assetProfitLoss} days={AssetStore.assetHistoryBrakedownDates} />
          </Paper>
        </Grid>

        {/* <Grid container className={classes.bigTopPadding}>
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
        </Grid> */}
      </Grid>
    );
  }
}

export default withStyles(styles)(ProfitLoss);
