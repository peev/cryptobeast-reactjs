// @flow
import React, { createRef } from 'react';
import { observer } from 'mobx-react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

type Props = {
  chartData: Object,
  days: Object,
};

const ProfitLossGlobalChart = (observer(({ chartData, days }: Props) => {
  const chart = createRef();
  if (chart !== undefined) {
    //chart.xAxis[0].setExtremes(0, 0);
  }
  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'PORTFOLIO DAILY PROFIT AND LOSS',
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

export default ProfitLossGlobalChart;
