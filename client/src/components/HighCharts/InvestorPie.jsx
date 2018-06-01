// @flow
import React, { Component } from 'react';
import Highcharts from 'highcharts';
import {
  HighchartsChart,
  withHighcharts,
  Legend,
  Tooltip,
  PieSeries,
} from 'react-jsx-highcharts';

type Props = {
  investors: Array,
  portfolioShares: Float,
};

class InvestorPieChart extends Component<Props> {
  state = {};
  render() {
    const { investors, portfolioShares } = this.props;
    const pieData = investors.map((inv: Object) => {
      const invSharesWeight = (inv.purchasedShares / portfolioShares) * 100;
      return {
        name: inv.fullName,
        y: Number(`${Math.round(`${invSharesWeight}e2`)}e-2`),
      };
    });

    return (
      <HighchartsChart>
        <Legend layout="vertical" align="right" verticalAlign="middle" />

        <Tooltip />

        <PieSeries
          type="Pie"
          id="total-consumption"
          name="Total Shares"
          data={pieData}
          center={[200, 120]}
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
