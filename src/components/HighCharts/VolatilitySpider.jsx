import React, { Component } from "react";
import HighCharts from "highcharts";
import {
  HighchartsChart,
  withHighcharts,
  YAxis,
  Legend,
  Tooltip,
  PolygonSeries,
  XAxis,
  Chart,
  Subtitle,

} from "react-jsx-highcharts";
import HighchartsMore from "highcharts-more";
import ReactHighcharts from "react-highcharts";

HighchartsMore(ReactHighcharts.Highcharts);

class VolatilitySpiderChart extends Component {
  state = {};

  render() {
    const spiderData = [
      {
        label: "Global Equities",
        y: 2
      },
      {
        label: "Tech Index",
        y: 32
      },
      {
        label: "USBONDS",
        y: 21
      },
      {
        label: "US Equity",
        y: 8
      },
      {
        label: "Nat Gas",
        y: 7
      },
      {
        label: "Mexico",
        y: 4
      }
    ];

    const spiderDataX = [
      {
        label: "Global Equities",
        x: -8
      },
      {
        label: "Tech Index",
        y: -32
      },
      {
        label: "USBONDS",
        y: -21
      },
      {
        label: "US Equity",
        y: 58
      },
      {
        label: "Nat Gas",
        y: 87
      },
      {
        label: "Mexico",
        y: -4
      }
    ];

    return (
      <HighchartsChart type="polar">
        <Chart type="polar" />


        <Subtitle>Source: thesolarfoundation.com</Subtitle>

        <Legend layout="vertical" align="right" verticalAlign="middle" />

        <XAxis>
          <XAxis.Title>Time</XAxis.Title>
        </XAxis>

        <YAxis id="number">
          <YAxis.Title>Number of employees</YAxis.Title>
          <PolygonSeries
            id="installation"
            name="Installation"
            data={[43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]}
          />
        </YAxis>
      </HighchartsChart>
    );
  }
}

export default withHighcharts(VolatilitySpiderChart, HighCharts);
