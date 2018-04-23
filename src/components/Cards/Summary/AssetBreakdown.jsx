import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid } from 'material-ui';
import Typography from 'material-ui/Typography';

import Highcharts from 'highcharts';
import {
  HighchartsChart,
  withHighcharts,
  YAxis,
  Legend,
  Tooltip,
  PieSeries,

} from 'react-jsx-highcharts';

const styles = () => ({
  button: {
    float: 'right',
  },
});

class AssetBreakdown extends React.Component {
  state = {};

  render() {
    const { classes } = this.props;

    const pieData = [
      {
        name: 'Jane',
        y: 17,
      },
      {
        name: 'John',
        y: 13,
      },
      {
        name: 'Joe',
        y: 20,
      },
      {
        name: 'Ivan',
        y: 50,
      },
    ];

    return (
      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          <Typography
            variant="title"
            id="modal-title"
            style={{ fontSize: '18px', fontWeight: '400' }}
          >
            Shareholders Breakdown
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <HighchartsChart className="tessstssssssssssssss">
            <Legend layout="vertical" align="right" verticalAlign="middle" />

            <Tooltip animation pointFormat={pieData.y} />

            <YAxis id="number" className="tessstssssssssssssss">
              <PieSeries
                type="Pie"
                id="total-consumption"
                className="tessstssssssssssssss"
                name="Total Shares"
                data={pieData}
                center={[300, 120]}
                size={255}
                tooltip={{ valueSuffix: "%" }}
                showInLegend
                dataLabels={{ enabled: true, }}
              />
            </YAxis>
          </HighchartsChart>
        </Grid>
      </Grid>
    );
  }
}

AssetBreakdown.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withHighcharts(AssetBreakdown, Highcharts));
