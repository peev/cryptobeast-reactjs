// @flow
import React from 'react';
import { withStyles, Grid } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';

import InvestorCard from '../../CustomElements/InvestorCard';
import Button from '../../CustomButtons/Button';
import InvestorCardButton from '../../CustomButtons/InvestorCardButton';
import buttonStyle from '../../../variables/styles/buttonStyle';
import InvestorPieChart from '../../HighCharts/InvestorPie';
// import Portfolio from '../../Tabs/SummaryItems/Portfolio';

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
class SharesInCirculation extends React.Component<Props, State> {
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
    const purchasedShares = PortfolioStore.currentPortfolioInvestors.filter((el: object) => el.purchasedShares > 0);
    const { selectedPortfolio } = PortfolioStore;
    const portfolioShares = selectedPortfolio ? selectedPortfolio.shares : 0;

    return (
      <Grid container>
        <InvestorCardButton onClick={this.handleOpen}>
          <InvestorCard headerText={portfolioShares} labelText="Shares in Circulation" />
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
                  Shareholders Breakdown
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <InvestorPieChart
                  investors={purchasedShares}
                  portfolioShares={portfolioShares}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} >
                <Button
                  style={{ float: 'right' }}
                  onClick={this.handleClose}
                  color="primary"
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </Grid>
    );
  }
}

export default withStyles(styles, buttonStyle)(SharesInCirculation);
