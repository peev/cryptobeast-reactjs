// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import Modal from '@material-ui/core/Modal';
import InvestorCard from '../../CustomElements/InvestorCard';
import Button from '../../CustomButtons/Button';
import InvestorCardButton from '../../CustomButtons/InvestorCardButton';
import SharePriceChart from '../../HighCharts/SharePriceChart';

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
  buttonStyle: {
    '& button': {
      backgroundColor: '#fff',
      boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0, 0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    },
    '& button:hover': {
      backgroundColor: '#aaa',
      '& h4, & p': {
        color: '#fff',
      },
    },
    '& h4': {
      fontSize: '20px',
      fontWeight: '700',
      color: '#000',
      marginBottom: '5px',
    },
    '& p': {
      color: '#000',
      fontSize: '13.3px',
    },
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
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, PortfolioStore } = this.props;

    return (
      <Grid container className={classes.buttonStyle}>
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
                  style={{ fontSize: '18px', fontWeight: '400', marginBottom: '20px' }}
                >
                  Share Price Breakdown
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <SharePriceChart
                  sharePriceOnly
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Button
                  style={{ float: 'right' }}
                  color="primary"
                  className={classes.button}
                  onClick={this.handleClose}
                >
                  Close
                </Button>
              </Grid >
            </Grid>
          </div>
        </Modal>
      </Grid>
    );
  }
}

export default withStyles(styles)(CurrentSharePrice);
