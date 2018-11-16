// @flow
import React from 'react';
import ReactHighcharts from 'react-highcharts';
import { observer } from 'mobx-react';

type Props = {
  currency: string,
  chartData: Object,
  days: Object,
};

const ProfitLossChart = (observer(({ currency, chartData, days }: Props) => {
  const config = {
    chart: {
      type: 'column',
    },
    title: {
      text: `${currency} DAILY PROFIT AND LOSS`,
    },
    xAxis: {
      categories: days,
      scrollbar: {
        enabled: true,
      },
    },
    yAxis: {
      title: {
        text: 'Profit and Loss in %',
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [{
      name: currency,
      data: chartData,
    }],
  };
  return (
    <ReactHighcharts config={config} />
  );
}));

export default ProfitLossChart;
