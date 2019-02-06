// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { inject, observer } from 'mobx-react';

const styles = () => ({
  text: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    padding: '10px 23px',
    color: 'white',
    backgroundColor: '#133140',
    fontSize: '16px',
    fontWeight: '500',
    // textTransform: 'uppercase',
    height: '21px',
  },
  container: {
    height: '320px',
    paddingRight: '80px',
    paddingTop: '6px',
    boxShadow: 'inset 0 7.5px 9px -7px rgba(0,0,0,0.6)',
  },
  containerParagraph: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    paddingTop: '0 !important',
    textAlign: 'center',
  },
  paper: {
    marginLeft: '20px',
  },
});

type Props = {
  classes: Object,
  PortfolioStore: Object,
};

@inject('PortfolioStore')
@observer
class AssetBreakdown extends React.Component<Props> {
  state = {};

  render() {
    const { classes, PortfolioStore } = this.props;
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
          center: [205, 115],
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
        data: PortfolioStore.summaryAssetsBreakdown,
      }],
    };


    return (
      <Paper className={classes.paper}>
        <Grid container >
          <Grid item xs={12} sm={12} md={12} className={classes.containerParagraph}>
            <Typography
              variant="title"
              id="modal-title"
              className={classes.text}
            >
              Asset Allocation
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={12} id="main">
          <div className={classes.container}>
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
            />
          </div>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(AssetBreakdown);
