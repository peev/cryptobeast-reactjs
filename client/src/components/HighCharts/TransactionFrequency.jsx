import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import Boost from "highcharts-boost";
Boost(ReactHighcharts.Highcharts)

class TransactionFrequency extends Component {
  render() {
    const { ranges } = this.props;

    let data = [];
    let dates = [];
    for (let counter = 0; counter < ranges.length; counter++) {
      data.push(ranges[counter][1]);
      let date = new Date(ranges[counter][0]);
      dates.push(date.getDate() + '.' + date.getUTCMonth() + '.' + date.getFullYear());
    }
    let config = {
      title: {
        text: 'Transaction Frequency'
      },

      yAxis: {
        title: {
          text: 'Number of transactions'
        }
      },

      xAxis: {
        categories: dates,
        labels: {
          step: 40
        }
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          }
        }
      },

      series: [{
        name: 'Transaction Frequency',
        data: data
      }],
    };
    return (
      <ReactHighcharts config={config} />
    );
  }
}

export default TransactionFrequency;
