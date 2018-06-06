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
  const { classes, Analytics, PortfolioStore } = props;
  const initialPortfolioCost = Analytics.currentPortfolioPriceHistoryBreakdown[0][1];
  const data = Analytics.currentPortfolioPriceHistoryBreakdown
    .map((ph: Array, i: Integer) => {
      const currentPrice = ph[1];
      const change = i > 0 ? (((currentPrice - initialPortfolioCost) / initialPortfolioCost) * 100) : 0;
      const value = Number(`${Math.round(`${change}e2`)}e-2`);
      return [ph[0], value, null];
    });

  let data2;
  if (Analytics.currentPortfolioBTCPriceHistory.length > 0) {
    const initialBtcPrice = Analytics.currentPortfolioBTCPriceHistory[0][1];
    data2 = Analytics.currentPortfolioBTCPriceHistory
      .map((ph: Array, i: Integer) => {
        const currentPrice = ph[1];
        const change = i > 0 ? (((currentPrice - initialBtcPrice) / initialBtcPrice) * 100) : 0;
        const value = Number(`${Math.round(`${change}e2`)}e-2`);
        return [ph[0], value, null];
      });
  }

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
