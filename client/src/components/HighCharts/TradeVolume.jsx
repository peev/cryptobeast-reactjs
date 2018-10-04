import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';

class TradeVolumeChart extends Component {
  state = {};

  render() {
    const { data } = this.props;
    // split the data set into ohlc and volume
    let ohlc = [],
      volume = [],
      groupingUnits = [[
        'week',                         // unit name
        [1]                             // allowed multiples
      ], [
        'month',
        [1, 2, 3, 4, 6]
      ]],
      i = 0;

    for (i; i < data.length; i += 1) {
      ohlc.push([
        +(new Date(data[i]['Date'])), // the date
        +data[i]['Open'], // open
        +data[i]['High'], // high
        +data[i]['Low'], // low
        +data[i]['Close'] // close
      ]);

      volume.push([
        +(new Date(data[i]['Date'])), // the date
        +data[i]['Volume To'] // the volume
      ]);
    }

    const config = {
      rangeSelector: {
        selected: 1
      },

      title: {
        text: 'BTC-USD 30-Day Transaction Frequency'
      },

      yAxis: [{
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },

      series: [{
        type: 'candlestick',
        name: 'AAPL',
        data: ohlc,
        dataGrouping: {
          units: groupingUnits
        }
      }, {
        type: 'column',
        name: 'Volume',
        data: volume,
        yAxis: 1,
        dataGrouping: {
          units: groupingUnits
        }
      }]
    };

    return (
      <ReactHighstock config={config} />
    );
  }
}

export default TradeVolumeChart;
