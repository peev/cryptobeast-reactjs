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
    },
    title: {
      text: 'Total assets value',
    },
    subtitle: {
      text: document.ontouchstart === undefined ?
        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: 'Exchange rate',
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
      data: Allocations.allocationsBreakdown,
    }],
  };

  return (
    <ReactHighcharts config={config} />
  );
}));

export default TotalAssetsValue;
