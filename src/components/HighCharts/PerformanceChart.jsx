import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';
import Highcharts from 'highcharts/highstock';
import {
  HighchartsStockChart,
  Chart,
  withHighcharts,
  XAxis,
  YAxis,
  Navigator,
  RangeSelector,
  SplineSeries,
  Tooltip,
} from 'react-jsx-highstock';


const styles = () => ({
  container: {
    height: '100%',
    '&>div': {
      margin: '0',
    }
  },
});

const createDataPoint = (time = Date.now(), magnitude = 100, offset = 0) => {
  return [time + (offset * magnitude), Math.round(Math.random() * 20 * 2) / 2];
};

const createRandomData = (time, magnitude) => {
  const data = [];

  for (let i = 0; i <= 100; i++) {
    data.push(createDataPoint(time, magnitude, i));
  }
  return data;
};

const PerformanceChart = (props) => {
  const { classes } = props;
  const now = Date.now();
  const data = createRandomData(now, 1e8);

  const data2 = createRandomData(now, 1e8);

  return (
    <HighchartsStockChart className={classes.container}>
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

      <Tooltip valueSuffix="%" shared />
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
  );
};

PerformanceChart.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withHighcharts(PerformanceChart, Highcharts));
