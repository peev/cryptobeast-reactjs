import React, { Component } from 'react';
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

type Props = {
  data: Array,
  currencies: Array,
};

class ProfitLossGlobalChart extends React.Component<Props> {
  render() {
    const { currencies, data, days } = this.props;
    if(!data.ready || !currencies.length) {
      return null;
    }
    let dataSeries = [];
    let currenciesData = [];
    currencies.forEach((val) => {
      let average = 0;
      currenciesData.push(val.pair);
      console.log('data[val.pair]', val.pair)
      console.log('data[val.pair]', data[val.pair])
      if(data[val.pair]) {
        for(let counter = 0; counter < days; counter++) {
          average += parseFloat(data[val.pair][counter]['Daily Profit and Loss']);
        }
        average /= days;
        dataSeries.push(average);
      } else {
        dataSeries.push(0);
      }
    });
    console.log(dataSeries);

    return (
      <HighchartsChart>
        <Chart />

        <Title>PROFIT AND LOSS OF EACH ASSET</Title>

        <Legend 
          enabled={false}
        />

        <XAxis
          categories={currenciesData}
        />

        <YAxis id="number">
          <YAxis.Title>Profit and Loss in %</YAxis.Title>
          <ColumnSeries name="asd" data={dataSeries} />
        </YAxis>
      </HighchartsChart>
    );
  }
}

export default withHighcharts(ProfitLossGlobalChart, Highcharts);
