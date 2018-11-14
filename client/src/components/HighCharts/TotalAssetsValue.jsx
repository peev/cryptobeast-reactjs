// @flow
import React from 'react';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts';
import { inject, observer } from 'mobx-react';

type Props = {
  Allocations: Object,
};

const TotalAssetsValue = inject('Allocations')(observer(({ ...props }: Props) => {
  const { Allocations } = props;

  const config = {
    chart: {
      zoomType: 'x',
      height: 320,
    },
    title: {
      text: 'Total assets value',
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: 'datetime',
      data: Allocations.allocationsBreakdownDates,
    },
    yAxis: {
      title: {
        text: 'Exchange rate',
      },
      labels: {
        overflow: 'allow',
      },
    },
    legend: {
      enabled: true,
    },
    plotOptions: {
      area: {
        marker: {
          radius: 2,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
      },
    },

    series: [{
      id: 'eth',
      type: 'area',
      name: 'ETH value',
      color: Highcharts.getOptions().colors[0],
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1,
        },
        stops: [
          [0, Highcharts.getOptions().colors[0]],
          [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')],
        ],
      },
      data: Allocations.allocationsBreakdownETH,
    },
    {
      id: 'usd',
      type: 'area',
      name: 'USD value',
      color: Highcharts.getOptions().colors[2],
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1,
        },
        stops: [
          [0, Highcharts.getOptions().colors[2]],
          [1, Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0).get('rgba')],
        ],
      },
      data: Allocations.allocationsBreakdownUSD,
    }],
  };

  return (
    <ReactHighcharts config={config} />
  );
}));

export default TotalAssetsValue;
