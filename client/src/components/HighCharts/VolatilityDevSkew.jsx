// @flow
import React from 'react';
import ReactHighcharts from 'react-highcharts';
import { inject, observer } from 'mobx-react';

const VolatilityColumnChart = inject('AssetStore')(observer(({ ...props }: Props) => {
  const { AssetStore } = props;
  console.log(AssetStore.assetsStdDeviations);
  console.log(AssetStore.assetsSkewness);
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
      data: AssetStore.assetsStdDeviations,
    }, {
      name: 'SKEWNESS',
      data: AssetStore.assetsSkewness,
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
