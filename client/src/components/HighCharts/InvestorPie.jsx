import React, { Component } from 'react';
import Highcharts from 'highcharts';
import {
  HighchartsChart,
  withHighcharts,
  Legend,
  Tooltip,
  PieSeries,
} from 'react-jsx-highcharts';

class InvestorPieChart extends Component {
  state = {};

  render() {
    const pieData = [
      {
        name: 'Jane',
        y: 17,
      },
      {
        name: 'John',
        y: 13,
      },
      {
        name: 'Joe',
        y: 20,
      },
      {
        name: 'Ivan',
        y: 50,
      },
    ];

    return (
      <HighchartsChart>
        <Legend layout="vertical" align="right" verticalAlign="middle" />

        <Tooltip />

        <PieSeries
          type="Pie"
          id="total-consumption"
          name="Total Shares"
          data={pieData}
          center={[300, 120]}
          size={255}
          tooltip={{ valueSuffix: '%' }}
          showInLegend
          dataLabels={{ enabled: true }}
        />
      </HighchartsChart>
    );
  }
}

export default withHighcharts(InvestorPieChart, Highcharts);
