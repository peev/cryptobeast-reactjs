// @flow
import React from 'react';
import { withStyles } from 'material-ui';
import Highcharts from 'highcharts/highstock';
import { inject, observer } from 'mobx-react';

import {
  HighchartsStockChart,
  Chart,
  withHighcharts,
  XAxis,
  YAxis,
  Navigator,
  RangeSelector,
  SplineSeries,
  Tooltip,
} from 'react-jsx-highstock';


const styles = () => ({
  container: {
    overflow: 'hidden',
    height: '100%',
    '&>div': {
      margin: '0',
    },
  },
});

type Props = {
  classes: Object,
  Analytics: Object,
  // PortfolioStore: Object,
};

@inject('PortfolioStore', 'Analytics')
@observer
class PerformanceChart extends React.Component<Props> {
  componentDidUpdate() {
    // This is needed because the StockChart does not redraw on data changes
    const rangeSelectors = document.querySelectorAll("svg > g.highcharts-range-selector-group > g > g:nth-child(4)"); // eslint-disable-line
    if (rangeSelectors.length > 0) {
      const wholeRange = rangeSelectors[0];
      if (wholeRange.onclick) {
        // Force redraw by clicking the range selector buttons
        // In this case the "All" button
        wholeRange.onclick();
      }
    }
  }
  render() {
    const { classes, Analytics } = this.props;
    // const data3 = Analytics.currentPortfolioPriceHistoryBreakdown;
    const data3 = Analytics.currentPortfolioClosingSharePricesBreakdown;
    // console.log(data3);

    return (
      <HighchartsStockChart className={classes.container}>
        <Chart zoomType="x" />
        <RangeSelector>
          <RangeSelector.Button count={7} type="day">
            7d
          </RangeSelector.Button>

          <RangeSelector.Button count={1} type="month">
            1m
          </RangeSelector.Button>

          <RangeSelector.Button type="all">All</RangeSelector.Button>
        </RangeSelector>

        <Tooltip valuePrefix="$ " shared />
        <XAxis />

        <YAxis id="price" opposite >
          <YAxis.Title>U S D</YAxis.Title>
          <SplineSeries id="CSP" name="Closing Share Price" data={data3} />
        </YAxis>

        <Navigator>
          <Navigator.Series seriesId="portfolio" />
        </Navigator>
      </HighchartsStockChart>
    );
  }
}

export default withStyles(styles)(withHighcharts(PerformanceChart, Highcharts));
