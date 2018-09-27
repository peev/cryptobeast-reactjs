import React from 'react';
import Highcharts from 'highcharts';
import {
  HighchartsChart,
  withHighcharts,
  YAxis,
  XAxis,
  Legend,
  // Tooltip,
  Chart,
  ColumnSeries,
  Title,
} from 'react-jsx-highcharts';

class ProfitLossChart extends React.Component<Props, State> {
  render() {
    const { currency, data, days } = this.props;
    if(!data.ready || !currency.length) {
      return null;
    }
    let currencyData = data[currency].map((val) => {
      return parseFloat(val['Daily Profit and Loss']);
    });
    let dates = data[currency].map((val) => {
      return val.Date;
    });
    currencyData.length = days;
    dates = dates.reverse();
    currencyData = currencyData.reverse();
    return (
      <HighchartsChart>
        <Chart />

        <Title>PROFIT AND LOSS</Title>

        <Legend />


        <XAxis
          categories={dates}
        />

        <YAxis id="number">
          <YAxis.Title>Profit and Loss in %</YAxis.Title>
          <ColumnSeries name={currency || 'BTC'} data={currencyData} />
        </YAxis>
      </HighchartsChart>
    );
  }
}

export default withHighcharts(ProfitLossChart, Highcharts);
