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
import SummaryCard from './../../components/Cards/Summary/SummaryCard';
import AssetBreakdown from './../../components/Cards/Summary/AssetBreakdown';
import SummaryTabs from './../../components/Tabs/SummaryTabs';
import PortfolioSummaryTable from './../../components/CustomTables/PortfolioSummaryTable';

const styles = () => ({
  container: {
    // marginTop: '20px',
  },
  containerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0',
  },
  containerMiddle: {
    margin: '50px 0',
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

const Summary = inject('PortfolioStore')(observer(({ ...props }: Props) => {
  const { classes, PortfolioStore } = props;

  const handleInfoMessage = () => {
    if (PortfolioStore.summaryTotalInvestmentInUSD === 0 && PortfolioStore.currentPortfolioCostInUSD > 0) {
      return ('Please add new investor or edit your personal investment amount.');
    } else if (PortfolioStore.summaryTotalInvestmentInUSD > 0 && PortfolioStore.currentPortfolioCostInUSD === 0) {
      return ('Please add assets to the portfolio to see total profit/loss.');
    } else {
      return ('Please add new investor or edit your personal investment amount. Please add some assets to your portfolio.');
    }
  };

  return (
    <Grid container>
      <Grid container className={classes.container}>
        <Grid container spacing={8} className={classes.containerHeader}>
          <SummaryCard
            icon={TotalIcon}
            iconColor="gray"
            title="Total number of shares"
            description={PortfolioStore.summaryTotalNumberOfShares}
          />

          <SummaryCard
            icon={AscendantBarsIcon}
            iconColor="gray"
            title="Share price"
            description={PortfolioStore.summaryTotalNumberOfShares !== 0
              ? `$${PortfolioStore.currentPortfolioSharePrice.toFixed(2)}`
              : ''}
            hasInfo={PortfolioStore.summaryTotalNumberOfShares === 0}
            infoMessage="Please add an investment to see your current share price"
          />

          <SummaryCard
            icon={DollarIcon}
            iconColor="gray"
            title="USD equivalent"
            // description={`$${PortfolioStore.currentPortfolioCostInUSD.toFixed(2) || ''}`}
            description={PortfolioStore.currentPortfolioCostInUSD !== 0
              ? `$${PortfolioStore.currentPortfolioCostInUSD.toFixed(2)}`
              : ''}
            hasInfo={PortfolioStore.currentPortfolioCostInUSD === 0}
            infoMessage="Please add assets to your portfolio"
          />

          <SummaryCard
            icon={CoinIcon}
            iconColor="gray"
            title="Total purchase price"
            description={PortfolioStore.summaryTotalInvestmentInUSD !== 0
              ? `$${PortfolioStore.summaryTotalInvestmentInUSD}`
              : ''}
            hasInfo={PortfolioStore.summaryTotalInvestmentInUSD === 0}
            infoMessage="Please add new investor or edit your personal investment amount"
          />

          <SummaryCard
            icon={AnalyticsIcon}
            iconColor="gray"
            title="Total profit/loss"
            description={PortfolioStore.summaryTotalProfitLoss === 0
              ? ''
              : PortfolioStore.summaryTotalProfitLoss > 0
                ? `+${PortfolioStore.summaryTotalProfitLoss}%`
                : `${PortfolioStore.summaryTotalProfitLoss}%`}
            hasInfo={(PortfolioStore.summaryTotalInvestmentInUSD === 0 && PortfolioStore.currentPortfolioCostInUSD > 0)
              || (PortfolioStore.summaryTotalInvestmentInUSD > 0 && PortfolioStore.currentPortfolioCostInUSD === 0)
              || (PortfolioStore.summaryTotalInvestmentInUSD === 0 && PortfolioStore.currentPortfolioCostInUSD === 0)}
            infoMessage={handleInfoMessage()}
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
                { id: 'ticker', numeric: false, disablePadding: false, label: 'Ticker' },
                { id: 'holdings', numeric: false, disablePadding: false, label: 'Holdings' },
                { id: 'priceBTC', numeric: false, disablePadding: false, label: 'Price (BTC)' },
                { id: 'priceUSD', numeric: false, disablePadding: false, label: 'Price (USD)' },
                { id: 'totalUSD', numeric: false, disablePadding: false, label: 'Total Value (USD)' },
                { id: 'assetWeight', numeric: false, disablePadding: false, label: 'Asset Weight' },
                { id: '24Change', numeric: false, disablePadding: false, label: '24H Change' },
                { id: '7Change', numeric: false, disablePadding: false, label: '7D Change' },
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}));


export default withStyles(styles, summaryStyle)(Summary);
