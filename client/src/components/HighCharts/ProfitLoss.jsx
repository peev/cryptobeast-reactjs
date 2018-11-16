import React from 'react';
import ReactHighcharts from 'react-highcharts';

// eslint-disable-next-line react/prefer-stateless-function
class ProfitLossChart extends React.Component<Props, State> {
  render() {
    const { currency, chartData, days } = this.props;
    const config = {
      chart: {
        type: 'column',
      },
      title: {
        text: `${currency} DAILY PROFIT AND LOSS`,
      },
      xAxis: {
        categories: days,
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
  }
}

export default ProfitLossChart;
