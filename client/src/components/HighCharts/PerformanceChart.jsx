// @flow
import React from 'react';
import { withStyles } from 'material-ui';
import Highcharts from 'highcharts/highstock';
import { inject, observer } from 'mobx-react';

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
    },
  },
});


const createDataPoint = (
  time: Date = Date.now(), // Argument: Type = DefaultValue
  magnitude: number = 100, // Argument: Type = DefaultValue
  offset: number = 0, // Argument: Type = DefaultValue
) => [time + (offset * magnitude), Math.round(Math.random() * 20 * 2) / 2];


const createRandomData = (time: Date, magnitude: number) => {
  const data = [];

  for (let i = 0; i <= 100; i++) { // eslint-disable-line
    data.push(createDataPoint(time, magnitude, i));
  }
  return data;
};

type Props = {
  classes: Object,
  Analytics: Object,
  PortfolioStore: Object,
  MarketStore: Object,
};

const PerformanceChart = inject('Analytics', 'PortfolioStore', 'MarketStore')(observer(({ ...props }: Props) => {
  const { classes, Analytics, PortfolioStore, MarketStore } = props;
  const now = Date.now();
  const data = Analytics.currentPortfolioPriceHistoryBreakdown
    .map((ph: Array) => [ph[0], ph[1], null]);

  
  const data2 = createRandomData(now, 1);

  console.log('>>> MarketStore', MarketStore.marketPriceHistory);

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

      <Tooltip valueSuffix="$" shared />
      <XAxis />

      <YAxis id="price" opposite >
        <YAxis.Title>USD</YAxis.Title>
        <SplineSeries id="portfolio" name={PortfolioStore.selectedPortfolio ? PortfolioStore.selectedPortfolio.name : ''} data={data} />
        <SplineSeries id="BTC" name="BTC" data={data2} />
      </YAxis>

      <Navigator>
        <Navigator.Series seriesId="portfolio" />
        <Navigator.Series seriesId="BTC" />
      </Navigator>
    </HighchartsStockChart>
  );
}));

export default withStyles(styles)(withHighcharts(PerformanceChart, Highcharts));
