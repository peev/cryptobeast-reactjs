import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
import {
  Chart,
  withHighcharts,
  XAxis,
  YAxis,
  Title,
  Legend,
  AreaSplineSeries,
  SplineSeries,
  LineSeries,
  Subtitle,
  Tooltip,
} from 'react-jsx-highcharts';
import {
  HighchartsStockChart,
  Navigator,
  RangeSelector,
} from 'react-jsx-highstock';

import { createRandomData } from './datahelper';

class PerformanceChart extends Component {
  constructor(props) {
    super(props);

    const now = Date.now();
    this.state = {
   
    };
  }

  render() {
    const data1 = [1,2,3,4,5,6,];
    return (

      <HighchartsStockChart className="custom-component-chart">
        <Chart zoomType="x" />

        <Title>Custom Components</Title>

        <Subtitle>react-day-picker Date Pickers</Subtitle>

        <Legend>
          <Legend.Title>Key</Legend.Title>
        </Legend>

        <XAxis type="datetime">
          <XAxis.Title>Time</XAxis.Title>
        </XAxis>

        <YAxis id="price">
          <YAxis.Title>Price</YAxis.Title>
          <LineSeries id="profit" name="Profit" data={data1} />
        </YAxis>

        {/* <DateRangePickers axisId="xAxis" /> */}

        <Navigator>
          <Navigator.Series seriesId="profit" />
        </Navigator>
      </HighchartsStockChart>

    );
  }
}

export default withHighcharts(PerformanceChart, Highcharts);
