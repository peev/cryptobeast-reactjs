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

        <Title>Profit Loss Chart</Title>

        <Legend />

        <XAxis
          id="x"
          categories={['BTC', 'ETH', 'XRP', 'NEO', 'BNB', 'EOS']}
        />

        <YAxis id="number">
          <ColumnSeries id="jane" name="" data={[6, 4.5, 8.2, 4, 8.2, 7]} />
          <ColumnSeries id="john" name="" data={[0.3, 0.5, 0.4, 0.6, 0.5, 0.1]} />
          <ColumnSeries id="joe" name="" data={[2.2, 3.8, 2.8, 3.5, 0, 7]} />
        </YAxis>
      </HighchartsChart>
    );
  }
}

export default withHighcharts(ProfitLossChart, Highcharts);
