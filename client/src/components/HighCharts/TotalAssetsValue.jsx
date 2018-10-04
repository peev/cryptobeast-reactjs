// @flow
import React from 'react';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts';
import { inject, observer } from 'mobx-react';

type Props = {
  Analytics: Object,
  chartHeight: number
};

const TotalAssetsValue = inject('Analytics')(observer(({ ...props }: Props) => {
  const { Analytics, chartHeight } = props;

  const config = {
    chart: {
      zoomType: 'x',
      height: chartHeight || null,
    },
    title: {
      text: 'Total portfolio value',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: 'USD',
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      area: {
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
      type: 'area',
      name: 'USD value',
      data: Analytics.currentPortfolioPriceHistoryBreakdownMock,
    }],
  };

  return (
    <ReactHighcharts config={config} />
  );
}));

export default TotalAssetsValue;
