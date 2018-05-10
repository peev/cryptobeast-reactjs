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
  PortfolioStore: Object,
};

type State = {
  open: boolean,
};

@inject('PortfolioStore')
@observer
class CurrentSharePrice extends React.Component<Props, State> {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });

    this.props.PortfolioStore.getClosingSharePriceHistory();
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, PortfolioStore } = this.props;
    const loadingScreen = (<p>loading</p>);

    return (
      <Grid container>
        <InvestorCardButton
          onClick={this.handleOpen}
        >
          <InvestorCard headerText={`$${PortfolioStore.currentPortfolioSharePrice.toFixed(2)}`} labelText="Current Share Price" />
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
              <Grid item xs={12} sm={12} md={12}>
                <Typography
                  variant="title"
                  id="modal-title"
                  style={{ fontSize: '18px', fontWeight: '400' }}
                >
                  Share Price Breakdown
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                {PortfolioStore.currentPortfolioClosingSharePricesBreackdown.length > 0 ?
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
                      <XAxis.Title>Time Interval</XAxis.Title>
                    </XAxis>

                    {/* <YAxis id="price">
                      <YAxis.Title>USD</YAxis.Title>
                      <AreaSplineSeries id="profit" name="Opening Time" data={PortfolioStore.currentPortfolioClosingSharePricesBreackdown} />
                    </YAxis> */}

                    <YAxis id="social" opposite>
                      <YAxis.Title>USD</YAxis.Title>
                      <SplineSeries
                        id="twitter"
                        name="Closing Time"
                        data={PortfolioStore.currentPortfolioClosingSharePricesBreackdown}
                      />
                    </YAxis>

                    <Navigator>
                      <Navigator.Series seriesId="profit" />
                      <Navigator.Series seriesId="twitter" />
                    </Navigator>
                  </HighchartsStockChart>
                  : loadingScreen}
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Button
                  color="primary"
                  className={classes.button}
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
