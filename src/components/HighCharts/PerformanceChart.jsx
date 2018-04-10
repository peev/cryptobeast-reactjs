import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
import {
  HighchartsStockChart,
  Chart,
  withHighcharts,
  XAxis,
  YAxis,
  Title,
  Legend,
  LineSeries,
  Navigator,
  RangeSelector,
  SplineSeries,
  Tooltip
} from 'react-jsx-highstock';
// import { createRandomData } from "../utils/data-helpers";

// ../utils/data-helpers
const createDataPoint = (time = Date.now(), magnitude = 100, offset = 0) => {
  return [time + offset * magnitude, Math.round(Math.random() * 20 * 2) / 2];
};

const createRandomData = (time, magnitude) => {

  const data = [];

  for (let i = -99; i <= 0; i++) {
    data.push(createDataPoint(time, magnitude, i));
  }
  return data;
};

class PerformanceChart extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const now = Date.now();

    const data = createRandomData(now, 1e8);

    const data2 = createRandomData(now, 1e8);
    return (
      <div>
        <HighchartsStockChart>
          <Chart zoomType="x" />

          <RangeSelector>
            <RangeSelector.Button count={7} type="day">
              7d
            </RangeSelector.Button>
            <RangeSelector.Button count={1} type="month">
              1m
            </RangeSelector.Button>
            <RangeSelector.Button type="all">All</RangeSelector.Button>

          </RangeSelector>

          <Tooltip valueSuffix='%' shared />
          <XAxis />

          <YAxis id="price" opposite >
            <YAxis.Title>%</YAxis.Title>
            <SplineSeries id="portfolio" name="Basic Portfolio" data={data} />
            <SplineSeries id="BTC" name="BTC" data={data2} />
          </YAxis>

          <Navigator>
            <Navigator.Series seriesId="portfolio" />
            <Navigator.Series seriesId="BTC" />
          </Navigator>
        </HighchartsStockChart>
      </div>
    );
  }
}

export default withHighcharts(PerformanceChart, Highcharts);
