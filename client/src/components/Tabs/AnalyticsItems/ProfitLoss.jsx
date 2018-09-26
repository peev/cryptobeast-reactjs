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

@inject('MarketStore')
@observer
class ProfitLoss extends React.Component<Props, State> {
  state = {
    value: '',
    selectPeriod: '',
    globalSelectPeriod: '',
  };

  constructor(props) {
    super(props);
    this.handleSelectPeriod = this.handleSelectPeriod.bind(this);
    this.handleGlobalSelectPeriod = this.handleGlobalSelectPeriod.bind(this);
  }

  getPeriodInDays(val) {
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
        days = 365
        break;
    }
    return days;
  }

  handleSelectPeriod(data) {
    if (!data) {
      return;
    }
    this.setState({
      selectPeriod: this.getPeriodInDays(data)
    });
  }

  handleGlobalSelectPeriod(data) {
    if (!data) {
      return;
    }
    this.setState({
      globalSelectPeriod: this.getPeriodInDays(data)
    });
  }

  render() {
    const { classes, MarketStore } = this.props;
    const { selectPeriod, globalSelectPeriod } = this.state;
    let currencies = MarketStore.baseCurrencies;
    let profitLoss = MarketStore.profitLoss;

    let globalData = [];
    let selectedCurrency = 'BTC';
    let localSelectPeriod = selectPeriod || 30;
    let localGlobalSelectPeriod = globalSelectPeriod || 30;

    if (MarketStore.selectedBaseCurrency !== null) {
      selectedCurrency = MarketStore.selectedBaseCurrency.pair;
    }

    return (
      <Grid container className={classes.overflowNone}>
        <Grid container>
          <Grid item xs={6} className={[classes.flex, classes.flexCenter].join(' ')}>
            <SelectPeriod defaultValueIndex={0} selectedValue={this.handleGlobalSelectPeriod} />
          </Grid>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Paper className={[classes.maxWidth, classes.padding].join(' ')}>
            <ProfitLossGlobalChart currencies={currencies} data={profitLoss} days={localGlobalSelectPeriod}/>
          </Paper>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Grid item xs={6} className={[classes.flex, classes.flexCenter].join(' ')}>
            <SelectPeriod defaultValueIndex={0} selectedValue={this.handleSelectPeriod} values={['1w', '1m', '1y']} />
          </Grid>
          <Grid item xs={6} className={[classes.paddingLeft, classes.flex, classes.flexCenter].join(' ')}>
            <SelectBaseCurrency
              className={classes.inputWrapper}
              label="Select currency"
              validators={['isPositive']}
              style={{ textTransform: 'uppercase', fontSize: '14px' }}
            />
          </Grid>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Paper className={[classes.maxWidth, classes.padding].join(' ')}>
            <ProfitLossChart currency={selectedCurrency} data={profitLoss} days={localSelectPeriod} />
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
};

export default withStyles(styles)(ProfitLoss);