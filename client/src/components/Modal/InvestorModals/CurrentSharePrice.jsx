// @flow
import React from 'react';
import Typography from 'material-ui/Typography';
import { withStyles, Grid } from 'material-ui';
import {
  HighchartsStockChart,
  withHighcharts,
  XAxis,
  YAxis,
  Chart,
  Legend,
  Tooltip,
  Navigator,
  SplineSeries,
  RangeSelector,
  AreaSplineSeries,
} from 'react-jsx-highstock';
import Highcharts from 'highcharts/highstock';
import { inject, observer } from 'mobx-react';

import Modal from 'material-ui/Modal';
import InvestorCard from '../../CustomElements/InvestorCard';
import Button from '../../CustomButtons/Button';
import InvestorCardButton from '../../CustomButtons/InvestorCardButton';

const getModalStyle = () => {
  const top = 22;
  const left = 28;
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
};

const styles = (theme: Object) => ({
  paper: {
    position: 'absolute',
    minWidth: '100px',
    width: '600px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4,
  },
  button: {
    float: 'right',
  },
});

type Props = {
  classes: Object,
};

type State = {
  open: boolean,
};

@inject('MarketStore')
@observer
class CurrentSharePrice extends React.Component<Props, State> {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const data1 = [
      [1483232400000, 1.4, 4.7],
      [1483318800000, -1.3, 1.9],
      [1483405200000, -0.7, 4.3],
      [1483491600000, -5.5, 3.2],
      [1483578000000, -9.9, -6.6],
      [1483664400000, -9.6, 0.1],
      [1483750800000, -0.9, 4.0],
      [1483837200000, -2.2, 2.9],
      [1483923600000, 1.3, 2.3],
      [1484010000000, -0.3, 2.9],
      [1484096400000, 1.1, 3.8],
      [1484182800000, 0.6, 2.1],
      [1484269200000, -3.4, 2.5],
    ];

    const data2 = [
      [1483232400000, 1.4, 4.7],
      [1483318800000, -1.3, 1.9],
      [1483405200000, -0.7, 4.3],
      [1483491600000, -5.5, 3.2],
      [1483578000000, -9.9, -6.6],
      [1483664400000, -9.6, 0.1],
      [1483750800000, -0.9, 4.0],
      [1483837200000, -2.2, 2.9],
      [1483923600000, 1.3, 2.3],
      [1484010000000, -0.3, 2.9],
      [1484096400000, 1.1, 3.8],
      [1484182800000, 0.6, 2.1],
      [1484269200000, -3.4, 2.5],
    ];

    // console.log(data1[0][0], Date.now());

    return (
      <Grid container>
        <InvestorCardButton
          onClick={this.handleOpen}
        >
          <InvestorCard headerText="$2.65" labelText="Current Share Price" />
        </InvestorCardButton>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <div
            style={getModalStyle()}
            className={classes.paper}
          >
            <Grid container>
              <Grid item xs={12} sm={12} md={12} className={classes.containerParagraph}>
                <Typography
                  variant="title"
                  id="modal-title"
                  style={{ fontSize: '18px', fontWeight: '400' }}
                >
                  Share Price Breakdown
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={12} className={classes.containerParagraph}>
                <HighchartsStockChart>
                  <Chart zoomType="x" />
                  <Legend>
                    {/* <Legend.Title>Key</Legend.Title> */}
                  </Legend>

                  <RangeSelector>
                    <RangeSelector.Button count={1} type="day">1d</RangeSelector.Button>
                    <RangeSelector.Button count={7} type="day">7d</RangeSelector.Button>
                    <RangeSelector.Button count={1} type="month">1m</RangeSelector.Button>
                    <RangeSelector.Button type="all">All</RangeSelector.Button>
                    <RangeSelector.Input />
                  </RangeSelector>

                  <Tooltip />

                  <XAxis>
                    {/* <XAxis.Title>Time</XAxis.Title> */}
                  </XAxis>

                  <YAxis id="price">
                    {/* <YAxis.Title>Price difference</YAxis.Title> */}
                    <AreaSplineSeries id="profit" name="Closing" data={data1} />
                  </YAxis>

                  <YAxis id="social" opposite>
                    {/* <YAxis.Title>Present</YAxis.Title> */}
                    <SplineSeries id="twitter" name="Opening" data={data2} />
                  </YAxis>

                  <Navigator>
                    <Navigator.Series seriesId="profit" />
                    <Navigator.Series seriesId="twitter" />
                  </Navigator>
                </HighchartsStockChart>
              </Grid>

              <Grid item xs={12} sm={12} md={12} className={classes.containerParagraph}>
                <Button
                  className={classes.button}
                  color="primary"
                  onClick={this.handleClose}
                >
                  Cancel
                </Button>
              </Grid >
            </Grid>
          </div>
        </Modal>
      </Grid>
    );
  }
}

export default withStyles(styles)(withHighcharts(CurrentSharePrice, Highcharts));
