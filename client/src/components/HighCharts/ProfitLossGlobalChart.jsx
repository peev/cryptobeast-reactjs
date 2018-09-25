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

class ProfitLossGlobalChart extends Component {
  state = {};

  render() {
    return (
      <HighchartsChart>
        <Chart />

        <Title>PROFIT AND LOSS OF EACH ASSET</Title>

        <Legend 
          enabled={false}
        />

        <XAxis
          categories={['BTC', 'ETH', 'XRP', 'NEO', 'BNB', 'EOS']}
        />

        <YAxis id="number">
          <YAxis.Title>Profit and Loss in %</YAxis.Title>
          <ColumnSeries name="asd" data={[6, 4.5, 8.2, 4, -8.2, 7]} />
        </YAxis>
      </HighchartsChart>
    );
  }
}

export default withHighcharts(ProfitLossGlobalChart, Highcharts);
