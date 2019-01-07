// @flow
import React, { Component } from 'react';
import Highcharts from 'highcharts';
import BigNumberService from '../../services/BigNumber';

import {
  HighchartsChart,
  withHighcharts,
  Legend,
  Tooltip,
  PieSeries,
} from 'react-jsx-highcharts';

type Props = {
  shares: Object,
  portfolioShares: Float,
};

class InvestorPieChart extends Component<Props> {
  state = {};
  render() {
    const { shares, portfolioShares } = this.props;
    const filterEmpty = shares.filter((item: Object) => item.shares > 0);
    const pieData = filterEmpty.map((inv: Object) => {
      const invSharesWeight = (inv.shares / portfolioShares) * 100;
      return {
        name: `${inv.name} (${inv.shares || 0})`,
        y: Number(`${Math.round(`${invSharesWeight}e2`)}e-2`),
      };
    });

    console.log(shares);
    

    // const options = {
    //   chart: {
    //     plotBackgroundColor: null,
    //     plotBorderWidth: null,
    //     plotShadow: false,
    //     type: 'pie',
    //     height: 320,
    //   },
    //   title: {
    //     text: null,
    //   },
    //   tooltip: {
    //     valueSuffix: '%',
    //   },
    //   plotOptions: {
    //     pie: {
    //       allowPointSelect: true,
    //       cursor: 'pointer',
    //       size: 230,
    //       center: [205, 115],
    //       dataLabels: {
    //         enabled: true,
    //       },
    //       showInLegend: true,
    //     },
    //   },
    //   credits: {
    //     enabled: false,
    //   },
    //   legend: {
    //     align: 'right',
    //     verticalAlign: 'middle',
    //     layout: 'vertical',
    //   },
    //   series: [{
    //     name: 'Asset Breakdown:',
    //     colorByPoint: true,
    //     data: PortfolioStore.summaryAssetsBreakdown,
    //   }],
    // };

    return (
      <HighchartsChart>
        <Legend layout="vertical" align="right" verticalAlign="middle" />

        <Tooltip />

        <PieSeries
          type="Pie"
          id="total-consumption"
          name="Total Shares"
          data={pieData}
          center={[200, 150]}
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
