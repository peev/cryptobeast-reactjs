// @flow
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { inject, observer } from 'mobx-react';

type Props = {
  PortfolioStore: Object,
  chartHeight: number,
};

const TotalAssetsValue = inject('PortfolioStore')(observer(({ ...props }: Props) => {
  const { chartHeight, PortfolioStore } = props;

  const config = {
    chart: {
      zoomType: 'x',
      height: chartHeight || 'auto',
    },
    title: {
      text: 'Total assets value',
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: 'datetime',
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
      data: PortfolioStore.totalAssetsValue,
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
      data: PortfolioStore.totalAssetsValueUSD,
    }],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={config}
    />
  );
}));

export default TotalAssetsValue;
