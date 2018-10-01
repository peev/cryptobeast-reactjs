import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import TradeVolumeChart from '../../HighCharts/TradeVolume';
import TransactionFrequencyChart from '../../HighCharts/TransactionFrequency';
import MotionSelect from '../../Selectors/MotionSelect';

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
    color: '#ca3f58',
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
  textLeft: {
    textAlign: 'left'
  }
});

type Props = {
  classes: Object,
};

@inject('MarketStore')
@observer
class Liquidity extends React.Component<Props, State> {
  state = {
    selectPeriod: '',
    selectedCurrency: 'BTC'
  };

  handleSelectMarkey(data) {

  }

  handleSelectExchange(data) {
    
  }

  handleSelectPeriod(data) {
    
  }

  render() {
    const { classes, MarketStore } = this.props;
    let dates = [];
    let values = [];
    for (let counter = 0; counter < MarketStore.liquidity.length; counter++) {
      let date = new Date(MarketStore.liquidity[counter][0]);
      let day = date.getDate() + '';
      if (day.length === 1) {
        day = '0' + day;
      }
      let month = date.getUTCMonth() + 1 + '';
      if (month.length === 1) {
        month = '0' + month;
      }
      if (counter % 20  === 0) {
        dates.push(day + '-' + month + '-' + date.getFullYear());
      } else {
        dates.push('');
      }
      values.push(MarketStore.liquidity[counter][1]);
    }
    return (
      <Grid container className={classes.overflowNone}>
        <Grid container>
          <Grid item xs={2} className={[classes.marginRight, classes.flex, classes.flexCenter, classes.textLeft].join(' ')}>
          <MotionSelect defaultValueIndex={0} title={'Select Market'}
            selectedValue={this.handleSelectMarkey} values={['BTC-USD']}  />
          </Grid>
          <Grid item xs={2} className={[classes.marginRight, classes.flex, classes.flexCenter, classes.textLeft].join(' ')}>
            <MotionSelect defaultValueIndex={0} title={'Select Exchange'}
              selectedValue={this.handleSelectExchange} values={['Kraken']}  />
          </Grid>
          <Grid item xs={2} className={[classes.marginRight, classes.flex, classes.flexCenter, classes.textLeft].join(' ')}>
            <MotionSelect defaultValueIndex={0} title={'Select Period'}
              selectedValue={this.handleSelectPeriod} values={['1m', '5m', '1h', '1d']}  />
          </Grid>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Paper className={[classes.maxWidth, classes.padding].join(' ')}>
            <TransactionFrequencyChart dates={dates} values={values} />
          </Paper>
        </Grid>

        <Grid container className={classes.bigTopPadding}>
          <Paper className={[classes.maxWidth, classes.padding].join(' ')}>
            <TradeVolumeChart />
          </Paper>
        </Grid>
      </Grid>
    );
  }
};

export default withStyles(styles)(Liquidity);