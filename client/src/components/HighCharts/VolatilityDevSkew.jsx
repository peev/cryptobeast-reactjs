// @flow
import React from 'react';
import ReactHighcharts from 'react-highcharts';
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
      data: AssetStore.assetsStdDeviation,
    }, {
      name: 'SKEWNESS',
      data: AssetStore.assetsSkewness,
    }, {
      name: 'KURTOSIS',
      data: AssetStore.assetsKurtosis,
    }],
  };

  return (
    <ReactHighcharts config={config} />
  );
}));

export default VolatilityColumnChart;
