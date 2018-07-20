// @flow
import React from 'react';
import { withStyles, Grid, Paper, Typography } from 'material-ui';
import Highcharts from 'highcharts';
import {
  withHighcharts,
  HighchartsChart,
  Legend,
  PieSeries,
  Tooltip,
} from 'react-jsx-highcharts';
import { inject, observer } from 'mobx-react';


const styles = () => ({
  text: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    padding: '10px 23px',
    color: 'white',
    backgroundColor: '#133140',
    fontSize: '15px',
    fontWeight: '500',
    textTransform: 'uppercase',
    height: '21px',
  },
  container: {
    height: '314px',
    paddingRight: '80px',
  },
  containerParagraph: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    paddingTop: '0 !important',
    textAlign: 'center',
  },
  paper: {
    marginLeft: '20px',
  },
  legend: {
    transfrom: 'translateX(600)',
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
            <HighchartsChart className={classes.container}>
              <Legend layout="vertical" align="right" verticalAlign="middle" className={classes.legend} />

              <Tooltip />

              <PieSeries
                type="Pie"
                id="total-consumption"
                name="Asset Breakdown"
                data={PortfolioStore.summaryAssetsBreakdown}
                center={[205, 115]}
                size={230}
                tooltip={{ valueSuffix: '%' }}
                showInLegend
                dataLabels={{ enabled: true }}
              />
            </HighchartsChart>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(withHighcharts(AssetBreakdown, Highcharts));
