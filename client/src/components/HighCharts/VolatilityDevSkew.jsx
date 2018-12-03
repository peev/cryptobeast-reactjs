// @flow
import React from 'react';
import ReactHighcharts from 'react-highcharts';
import { inject, observer } from 'mobx-react';

const VolatilityColumnChart = inject('AssetStore')(observer(({ ...props }: Props) => {
  const { AssetStore } = props;
  console.log(AssetStore.assetsDeviation);
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
      data: AssetStore.assetsDeviation,
    }, {
      name: 'SKEWNESS',
      data: [2, 2, 3, 2, 1],
    }, {
      name: 'KURTOSIS',
      data: [3, 4, 4, 2, 5],
    }],
  };

  return (
    <ReactHighcharts config={config} />
  );
}));

export default VolatilityColumnChart;
