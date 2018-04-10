import React, { Component } from "react";
import Highcharts from "highcharts/highstock";
import {
  HighchartsStockChart,
  Chart,
  withHighcharts,
  XAxis,
  YAxis,
  Title,
  Legend,
  LineSeries,
  Navigator,
  RangeSelector,
  SplineSeries,
  AreaSeries,
  AreaRangeSeries,
  PolygonSeries,
  Tooltip
} from "react-jsx-highstock";
import addHighchartsMore from "highcharts/highcharts-more";
// import { createRandomData } from "../utils/data-helpers";

addHighchartsMore(Highcharts);

class VolatilitySpiderChart extends Component {
  state = {};

  render() {
    return (
      <HighchartsStockChart className="test">
        <Chart type="line" polar />
        <Tooltip shared  />
        <Legend  />
        <Title>ASSETS BETAS (Absolute Values)</Title>
        <XAxis
          categories={[
            "Global Equities",
            "Tech Index",
            "USBONDS",
            "US Equity",
            "Nat Gas",
            "Mexico"
          ]}
          tickerPlacement="on"
          lineWidth={0}
        />
        <YAxis id="number" gridLineInterpolation="polygon">
          <LineSeries
            id="installation"
            name=">0"
            data={[2.15, 0.85, 3, 1.75, 0.85, 0.5]}
            lineWidth={2}
          />
          <LineSeries
            lineWidth={2}
            id="new"
            name="<0"
            data={[2.5, 2, 2.1, 1.55, 1.3, 0.7]}
          />
        </YAxis>
      </HighchartsStockChart>
    );
  }
}

export default withHighcharts(VolatilitySpiderChart, Highcharts);
