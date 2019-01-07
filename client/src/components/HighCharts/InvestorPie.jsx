// @flow
import React from 'react';
import { observer } from 'mobx-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

type Props = {
  shares: Object,
  portfolioShares: Float,
};

const InvestorPieChart = (observer(({ ...props }: Props) => {
  const { shares, portfolioShares } = props;
  const filterEmpty = shares.filter((item: Object) => item.shares > 0);
  const pieData = filterEmpty.map((inv: Object) => {
    const invSharesWeight = (inv.shares / portfolioShares) * 100;
    return {
      name: `${inv.name} (${Number(`${Math.round(`${invSharesWeight}e2`)}e-2`) || 0}%)`,
      y: Number(`${Math.round(`${invSharesWeight}e2`)}e-2`),
    };
  });

  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      height: 320,
    },
    title: {
      text: null,
    },
    tooltip: {
      valueSuffix: '%',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        size: 230,
        dataLabels: {
          enabled: true,
        },
        showInLegend: true,
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
    },
    series: [{
      name: 'Asset Breakdown:',
      colorByPoint: true,
      data: pieData,
    }],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
}));

export default InvestorPieChart;
