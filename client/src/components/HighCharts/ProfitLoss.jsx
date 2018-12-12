// @flow
import React from 'react';
import { inject, observer } from 'mobx-react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

type Props = {
  currency: string,
  chartData: Object,
  days: Object,
};


@inject('currency', 'chartData', 'days')
@observer
class ProfitLossChart extends React.Component<Props, State> {
  componentDidUpdate() {
    const chart = this.refs.chart;
    if (chart !== undefined) {
      chart.chart.xAxis[0].setExtremes(0, (this.props.chartData.length > 32) ? 30 : this.props.chartData.length - 1);
    }
  }

  render() {
    const { currency, days, chartData } = this.props;
    const options = {
      chart: {
        type: 'column',
      },
      title: {
        text: `${currency} DAILY PROFIT AND LOSS`,
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
        name: currency,
        data: chartData,
        color: Highcharts.getOptions().colors[2],
      }],
    };
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={'chart'}
      />
    );
  }
}

export default ProfitLossChart;
