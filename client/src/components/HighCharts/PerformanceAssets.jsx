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
    chart: {
      type: 'line',
    },
    title: {
      text: 'Share price history',
    },
    xAxis: {
      categories: Analytics.currentPortfolioClosingSharePricesBreakdown[0],
    },
    yAxis: {
      title: {
        text: 'USD',
      },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: false,
      },
    },
    series: [{
      name: 'Share price',
      data: Analytics.currentPortfolioClosingSharePricesBreakdown[1],
    }, {
      name: 'BTC',
      data: Analytics.currentPortfolioClosingSharePricesBreakdown[2],
    }, {
      name: 'ETH',
      data: Analytics.currentPortfolioClosingSharePricesBreakdown[3],
    }],
  };

  return (
    <ReactHighcharts config={config} />
  );
}));

export default PerformanceAssets;
