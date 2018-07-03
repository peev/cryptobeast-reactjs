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

type Props = {
  classes: Object,
  Analytics: Object,
  PortfolioStore: Object,
  MarketStore: Object,
};

const PerformanceChart = inject('Analytics', 'PortfolioStore')(observer(({ ...props }: Props) => {
  const { classes, Analytics } = props;
  // const data = Analytics.currentPortfolioPriceHistoryBreakdown;
  const data3 = Analytics.currentPortfolioClosingSharePricesBreakdown;


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

      <Tooltip valuePrefix="$ " shared />
      <XAxis />

      <YAxis id="price" opposite >
        <YAxis.Title>U S D</YAxis.Title>
        <SplineSeries id="CSP" name="Closing Share Price" data={data3} />
      </YAxis>

      <Navigator>
        <Navigator.Series seriesId="portfolio" />
      </Navigator>
    </HighchartsStockChart>
  );
}));

export default withStyles(styles)(withHighcharts(PerformanceChart, Highcharts));
