// @flow
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

const styles = () => ({
  shares: {
    color: '#009e73',
  },
  btc: {
    color: '#ff9f00',
  },
  eth: {
    color: '#3fa9ca',
  },
});

type Props = {
  PortfolioStore: Object,
  MarketStore: Object,
  classes: Object,
};

const SharePriceChart = inject('PortfolioStore', 'MarketStore')(observer(({ ...props }: Props) => {
  const { PortfolioStore, MarketStore, classes } = props;

  const config = {
    chart: {
      zoomType: 'xy',
    },
    title: {
      text: 'Protfolio share price',
    },
    xAxis: [{
      categories: PortfolioStore.sharePriceBreakdownDates,
      crosshair: true,
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%d %b %Y',
      },
    }],
    yAxis: [{
      gridLineWidth: 0,
      title: {
        text: 'ETH',
        style: {
          color: classes.etc,
        },
      },
      labels: {
        format: '{value}$',
        style: {
          color: classes.etc,
        },
      },
      opposite: true,
    }, {
      labels: {
        format: '{value}$',
        style: {
          color: classes.shares,
        },
      },
      title: {
        text: 'Share price',
        style: {
          color: classes.shares,
        },
      },
      opposite: false,
    }],
    tooltip: {
      shared: true,
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      x: 80,
      verticalAlign: 'top',
      y: 55,
      floating: true,
    },
    credits: {
      enabled: false,
    },
    series: [{
      name: 'Share price',
      type: 'spline',
      yAxis: 1,
      data: PortfolioStore.sharePriceBreakdownShares,
      tooltip: {
        valueSuffix: ' USD',
      },
      color: Highcharts.getOptions().colors[0],
    }, {
      name: 'ETH',
      type: 'spline',
      data: MarketStore.ethHistoryBreakdown,
      tooltip: {
        valueSuffix: ' USD',
      },
      color: Highcharts.getOptions().colors[2],
    }],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={config}
    />
  );
}));

export default withStyles(styles)(SharePriceChart);
