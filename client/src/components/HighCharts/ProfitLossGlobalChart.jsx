// @flow
import React from 'react';
import { observer } from 'mobx-react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

type Props = {
  portfolioHistoryEth: Object,
  portfolioHistoryUsd: Object,
  days: Object,
};

const ProfitLossGlobalChart = (observer(({ portfolioHistoryEth, portfolioHistoryUsd, days }: Props) => {
  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'PORTFOLIO DAILY PROFIT AND LOSS',
    },
    tooltip: {
      valueSuffix: '%',
    },
    xAxis: {
      categories: days,
      type: 'category',
      min: 0,
      scrollbar: {
        enabled: true,
      },
      tickLength: 0,
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
      name: 'In ETH',
      data: portfolioHistoryEth,
      color: Highcharts.getOptions().colors[0],
    }, {
      name: 'In USD',
      data: portfolioHistoryUsd,
      color: Highcharts.getOptions().colors[2],
    }],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
}));

export default ProfitLossGlobalChart;
