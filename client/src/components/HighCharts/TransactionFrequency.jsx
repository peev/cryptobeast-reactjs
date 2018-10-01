import React, { Component } from 'react';
import Highcharts from 'highcharts';
import {
  HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, LineSeries, Tooltip
} from 'react-jsx-highcharts';

class TransactionFrequencyChart extends Component {
  state = {};

  render() {
    const { dates, values } = this.props;

    return (
      <HighchartsChart>
        <Chart />

        <Title>BTC-USD 30-Day Transaction Frequency</Title>

        <Tooltip shared />

        <XAxis
          categories={dates}
          // labels={{ rotation: 0 }}
          // id="xAxis" startOnTick={true} endOnTick={true}
        />

        <YAxis>
          <LineSeries name="BTC-USD" data={values} />
        </YAxis>
      </HighchartsChart>
    );
  }
}

export default withHighcharts(TransactionFrequencyChart, Highcharts);
