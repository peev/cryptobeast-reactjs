// @flow
import React from 'react';
import ReactHighcharts from 'react-highcharts';
import { inject, observer } from 'mobx-react';

type Props = {
  Analytics: Object,
};

const PerformanceAssets = inject('Analytics')(observer(({ ...props }: Props) => {
  const { Analytics } = props;

  const config = {
    rangeSelector: {
      selected: 4,
    },

    yAxis: {
      labels: {
        formatter() {
          return `${this.value > 0 ? ' + ' : ''}${this.value}'%`;
        },
      },
      plotLines: [{
        value: 0,
        width: 2,
        color: 'silver',
      }],
    },

    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true,
      },
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
      valueDecimals: 2,
      split: true,
    },

    series: Analytics.currentPortfolioPriceHistoryBreakdown,
  };


  return (
    <ReactHighcharts config={config} />
  );
}));

export default PerformanceAssets;
