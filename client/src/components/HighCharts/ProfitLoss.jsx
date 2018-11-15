import React from 'react';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts';
import {
  HighchartsChart,
  withHighcharts,
  YAxis,
  XAxis,
  Tooltip,
  Chart,
  ColumnSeries,
  Title,
} from 'react-jsx-highcharts';

// eslint-disable-next-line react/prefer-stateless-function
class ProfitLossChart extends React.Component<Props, State> {
  render() {
    const { currency, data, days } = this.props;
    console.log(days);
    console.log(data);
    const config = {
      chart: {
        type: 'column',
      },
      title: {
        text: `${currency} DAILY PROFIT AND LOSS`,
      },
      xAxis: {
        categories: days,
      },
      yAxis: {
        title: {
          text: 'Profit and Loss in %',
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [{
        data: data,
      }],
    };
    return (
      <ReactHighcharts config={config} />
    );
    // const { currency, data, days } = this.props;
    // if (!data.ready || !currency.length) {
    //   return null;
    // }
    // let currencyData = data[currency].map(val => parseFloat(val['Daily Profit and Loss']));
    // let dates = data[currency].map((val) => {
    //   const date = new Date(val.Date);
    //   let day = `${date.getDate()} `;
    //   if (day.length === 1) {
    //     day = `0 ${day}`;
    //   }
    //   let month = `${date.getUTCMonth()} `;
    //   if (month.length === 1) {
    //     month = `0 ${month}`;
    //   }
    //   return `${day}-${month}-${date.getFullYear()}`;
    // });
    // currencyData.length = days;
    // dates = dates.reverse();
    // currencyData = currencyData.reverse();
    // return (
    //   <HighchartsChart>
    //     <Chart />
    //     <Tooltip shared />
    //     <Title>{`${currency} DAILY PROFIT AND LOSS`}</Title>
    //     <XAxis
    //       categories={dates}
    //     />
    //     <YAxis id="number">
    //       <YAxis.Title>Profit and Loss in %</YAxis.Title>
    //       <ColumnSeries name={currency || 'BTC'} data={currencyData} />
    //     </YAxis>
    //   </HighchartsChart>
    // );
  }
}

export default withHighcharts(ProfitLossChart, Highcharts);
