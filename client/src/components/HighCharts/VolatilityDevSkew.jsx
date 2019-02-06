// @flow
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { inject, observer } from 'mobx-react';

const VolatilityColumnChart = inject('AssetStore')(observer(({ ...props }: Props) => {
  const { AssetStore } = props;
  const config = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'STD.DEVIATION, SKEWNESS, KURTOSIS',
    },
    xAxis: {
      categories: AssetStore.protfolioAssetsTokenNames,
    },
    credits: {
      enabled: false,
    },
    series: [{
      name: 'STD.DEVIATION',
      data: AssetStore.assetsStdSkewnessKurtosis.std,
    }, {
      name: 'SKEWNESS',
      data: AssetStore.assetsStdSkewnessKurtosis.skewness,
    }, {
      name: 'KURTOSIS',
      data: AssetStore.assetsStdSkewnessKurtosis.kurtosis,
    }],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={config}
    />
  );
}));

export default VolatilityColumnChart;
