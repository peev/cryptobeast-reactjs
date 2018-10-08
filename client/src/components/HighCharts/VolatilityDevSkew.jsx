import React, { Component } from 'react';
import Highcharts from 'highcharts';
import {
  HighchartsChart,
  withHighcharts,
  YAxis,
  XAxis,
  Legend,
  Tooltip,
  Chart,
  ColumnSeries,
  Title,
} from 'react-jsx-highcharts';

class VolatilityColumnChart extends Component {
  state = {};

  render() {
    return (
      <HighchartsChart>
        <Chart />

        <Title>STD. DEVIATION, SKEWNESS, KURTOSIS</Title>

        <Tooltip shared />

        <Legend />

        <XAxis
          id="x"
          categories={['BTC', 'ETH', 'XRP', 'NEO', 'BNB', 'EOS']}
        />

        <YAxis id="number">
          <ColumnSeries id="jane" name="STD. DEVIATION" data={[6, 4.5, 8.2, 4, 8.2, 7]} />
          <ColumnSeries id="john" name="SKEWNESS" data={[0.3, 0.5, 0.4, 0.6, 0.5, 0.1]} />
          <ColumnSeries id="joe" name="KURTOSIS" data={[2.2, 3.8, 2.8, 3.5, 0, 7]} />
        </YAxis>
      </HighchartsChart>
    );
  }
}

export default withHighcharts(VolatilityColumnChart, Highcharts);
