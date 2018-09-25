import React, { Component } from 'react';
import Highcharts from 'highcharts';
import {
  HighchartsChart,
  withHighcharts,
  YAxis,
  XAxis,
  Legend,
  // Tooltip,
  Chart,
  ColumnSeries,
  Title,
} from 'react-jsx-highcharts';

class ProfitLossChart extends Component {
  state = {};

  render() {
    return (
      <HighchartsChart>
        <Chart />

        <Title>DAILY PROFIT AND LOSS</Title>

        <Legend />

        <XAxis />

        <YAxis id="number">
          <YAxis.Title>Profit and Loss in %</YAxis.Title>
          <ColumnSeries id="jane" name="BTC" data={[6, 4.5, 8.2, 4, -8.2, 7]} />
        </YAxis>
      </HighchartsChart>
    );
  }
}

export default withHighcharts(ProfitLossChart, Highcharts);
