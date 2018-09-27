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

type Props = {
  data: Array,
};

class ProfitLossGlobalChart extends React.Component<Props> {
  render() {
    const { data, days } = this.props;
    if(!data.ready) {
      return null;
    }
    let dataSeries = [];
    let currenciesData = [];
    for(let currency in data) {
      let average = 0;
      let passed = true;
      for(let counter = 0; counter < days; counter++) {
        if(counter === data[currency].length) {
          break;
        }
        if(!data[currency][counter]) {
          passed = false;
          break;
        }
        average += parseFloat(data[currency][counter]['Daily Profit and Loss']);
      }
      if(passed) {
        average /= days;
        dataSeries.push(average);
        currenciesData.push(currency);
      }
    }

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
