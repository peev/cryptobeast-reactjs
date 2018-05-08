// @flow
import React from 'react';
import { withStyles, Grid } from 'material-ui';
import { inject, observer } from 'mobx-react';

import summaryStyle from './../../variables/styles/summaryStyle';

import AnalyticsIcon from './../../components/CustomIcons/Summary/AnalyticsIcon';
import TotalIcon from './../../components/CustomIcons/Summary/TotalIcon';
import CoinIcon from './../../components/CustomIcons/Summary/CoinIcon';
import DollarIcon from './../../components/CustomIcons/Summary/DollarIcon';
import AscendantBarsIcon from './../../components/CustomIcons/Summary/AscendantBarsIcon';
import CreatePortfolio from './../../components/Modal/CreatePortfolio';
import SummaryCard from './../../components/Cards/Summary/SummaryCard';
import AssetBreakdown from './../../components/Cards/Summary/AssetBreakdown';
import SummaryTabs from './../../components/Tabs/SummaryTabs';
import PortfolioSummaryTable from './../../components/CustomTables/PortfolioSummaryTable';

const styles = () => ({
  container: {
    marginTop: '20px',
  },
  containerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0 30px',
  },
  containerMiddle: {
    margin: '20px 22px 0',
  },
  warningText: {
    marginTop: '35%',
    textAlign: 'center',
  },
  removePaddingBottom: {
    paddingBottom: '0',
  },
});

type Props = {
  classes: Object,
  PortfolioStore: Object,
};

@inject('PortfolioStore')
@observer
class Summary extends React.Component<Props> {
  state = {};

  render() {
    const { classes, PortfolioStore } = this.props;

    const createPortfolio = (
      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          <p className={classes.warningText}>
            You currently have no portfolio to display. Please create a
            portfolio to start
          </p>
          <CreatePortfolio />
        </Grid>
      </Grid>
    );

    const summaryContent = (
      <Grid container className={classes.container}>
        <Grid container spacing={8} className={classes.containerHeader}>
          <SummaryCard
            icon={TotalIcon}
            iconColor="gray"
            title="Total number of shares"
            description={PortfolioStore.selectedPortfolio ?
              PortfolioStore.selectedPortfolio.shares :
              0}
          />

          <SummaryCard
            icon={AscendantBarsIcon}
            iconColor="gray"
            title="Share price"
            description={PortfolioStore.selectedPortfolio ?
              (PortfolioStore.currentPortfolioSharePrice ? `$${PortfolioStore.currentPortfolioSharePrice.toFixed(2)}` : `$${1}`) :
              `$${0}`}
          />

          <SummaryCard
            icon={DollarIcon}
            iconColor="gray"
            title="USD equivalent"
            description={`$${PortfolioStore.currentSelectedPortfolioCost.toFixed(2) || ''}`}
          />

          <SummaryCard
            icon={CoinIcon}
            iconColor="gray"
            title="Total investment"
            description={`$${PortfolioStore.summaryTotalInvestment}`}
          />

          <SummaryCard
            icon={AnalyticsIcon}
            iconColor="gray"
            title="Total profit/loss"
            description={PortfolioStore.summaryTotalProfitLoss > 0 ?
              `+${PortfolioStore.summaryTotalProfitLoss}%` :
              `${PortfolioStore.summaryTotalProfitLoss}%`}
          />
        </Grid>

        <Grid container className={classes.containerMiddle}>
          <Grid item xs={6} sm={6} md={6} className={classes.removePaddingBottom}>
            <SummaryTabs />
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <AssetBreakdown />
          </Grid>
        </Grid>

        <Grid container className={classes.container}>
          <Grid item xs={12} sm={12} md={12}>
            <PortfolioSummaryTable
              tableHead={[
                'Ticker',
                'Holdings',
                'Price(BTC)',
                'Price(USD)',
                'Total Value(USD)',
                'Asset Weight',
                '24H Change',
                '7D Change',
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
    );

    const portfoliosArray = PortfolioStore.portfolios;

    return (
      <Grid container>
        {portfoliosArray.length > 0 ? summaryContent : createPortfolio}
      </Grid>
    );
  }
}

export default withStyles(styles, summaryStyle)(Summary);