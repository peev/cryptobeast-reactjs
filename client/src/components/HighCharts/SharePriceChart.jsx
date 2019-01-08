// @flow
import React from 'react';
import ReactHighcharts from 'react-highcharts';
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
  Analytics: Object,
  classes: Object,
};

const SharePriceChart = inject('Analytics')(observer(({ ...props }: Props) => {
  const { Analytics, classes } = props;

  const config = {
    chart: {
      zoomType: 'xy',
    },
    title: {
      text: 'Protfolio share price',
    },
    xAxis: [{
      categories: [],
      crosshair: true,
    }],
    yAxis: [{ // Primary yAxis
      labels: {
        format: '{value}$',
        style: {
          color: classes.shares,
        },
      },
      title: {
        text: 'ETC',
        style: {
          color: classes.shares,
        },
      },
      opposite: true,
    }, { // Secondary yAxis
      gridLineWidth: 0,
      title: {
        text: 'Share price',
        style: {
          color: classes.btc,
        },
      },
      labels: {
        format: '{value}$',
        style: {
          color: classes.btc,
        },
      },

    }, { // Tertiary yAxis
      gridLineWidth: 0,
      title: {
        text: 'BTC',
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
      // backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255,255,255,0.25)',
    },
    series: [{
      name: 'Share price',
      type: 'spline',
      yAxis: 1,
      data: [],
      tooltip: {
        valueSuffix: ' USD',
      },
    }, {
      name: 'BTC',
      type: 'spline',
      yAxis: 2,
      data: [],
      marker: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: ' USD',
      },
    }, {
      name: 'ETH',
      type: 'spline',
      data: [],
      tooltip: {
        valueSuffix: ' USD',
      },
    }],
  };


  return (
    <ReactHighcharts config={config} />
  );
}));

export default withStyles(styles)(SharePriceChart);
