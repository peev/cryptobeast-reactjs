import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import Boost from "highcharts-boost";
Boost(ReactHighcharts.Highcharts)
class TradeVolumeChart extends Component {
  state = {};

  render() {
    const { data } = this.props;
    const red = '#eb4562';
    const green = '#3ab693';
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

      volume.push({
        x: +(new Date(data[i]['Date'])),
        y: +data[i]['Volume To'],
        color: ((i === 0) || (+data[i]['Volume To'] > +data[i - 1]['Volume To'])) ? green : red
      });
    }

    let config = {
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

      plotOptions: {
        candlestick: {
          color: red,
          upColor: green
        }
      },

      series: [{
        type: 'candlestick',
        name: 'AAPL',
        data: ohlc,
        dataGrouping: {
          units: groupingUnits
        },
      }, {
        type: 'column',
        name: 'Volume',
        colorByPoint: true,
        data: volume,
        yAxis: 1,
        dataGrouping: {
          units: groupingUnits
        },
        turboThreshold: 0,
        boostThreshold: 0,
        cropThreshold: 0,
        allowForce: false,
        enabled: false
      }]
    };

    return (
      <ReactHighstock config={config} />
    );
  }
}

export default TradeVolumeChart;
