// @flow
import React, { createRef } from 'react';
import { observer } from 'mobx-react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

type Props = {
  currency: string,
  chartData: Object,
  days: Object,
};

const ProfitLossChart = (observer(({ currency, chartData, days }: Props) => {
  const chart = createRef();
  // TODO convert to react component
  const resetScroll = () => {
    if (chart !== undefined) {
      chart.xAxis[0].setExtremes(0, 0);
    }
  };
  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: `${currency} DAILY PROFIT AND LOSS`,
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
      name: currency,
      data: chartData,
    }],
  };
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chart}
    />
  );
}));

export default ProfitLossChart;
