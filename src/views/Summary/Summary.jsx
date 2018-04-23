import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid } from 'material-ui';
import summaryStyle from 'variables/styles/summaryStyle';

import { InfoOutline } from 'material-ui-icons';

import { inject, observer } from 'mobx-react';
import CreatePortfolio from '../../components/Modal/CreatePortfolio';
import SummaryCard from '../../components/Cards/SummaryCard';
import AssetBreakdown from '../../components/Cards/Summary/AssetBreakdown';

const styles = () => ({
  containerSummary: {
    marginTop: '20px',
  },
  containerHeader: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  warningText: {
    marginTop: '35%',
    textAlign: 'center',
  },
});

@inject('PortfolioStore')
@observer
class Summary extends React.Component {
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
      <Grid container className={classes.containerSummary}>
        <Grid container spacing={10} className={classes.containerHeader}>
          <SummaryCard
            icon={InfoOutline}
            iconColor="gray"
            title="Total number of shares"
            description={PortfolioStore.summaryTotalNumberOfShares}
          />

          <SummaryCard
            icon={InfoOutline}
            iconColor="gray"
            title="Share price"
            description={'$' + PortfolioStore.summarySharePrice}
          />

          <SummaryCard
            icon={InfoOutline}
            iconColor="gray"
            title="USD equivalent"
            description={'$' + PortfolioStore.summaryUsdEquivalent}
          />

          <SummaryCard
            icon={InfoOutline}
            iconColor="gray"
            title="Total investment"
            description={'$' + PortfolioStore.summaryTotalInvestment}
          />

          <SummaryCard
            icon={InfoOutline}
            iconColor="gray"
            title="Total profit/loss"
            description={PortfolioStore.summaryTotalProfitLoss > 0 ? '+' + PortfolioStore.summaryTotalProfitLoss + '%' : PortfolioStore.summaryTotalProfitLoss + '%'}
          />
        </Grid>

        <Grid container spacing={40} >
          <Grid item xs={6} sm={6} md={6}>
            <p>left</p>
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <AssetBreakdown />
          </Grid>
        </Grid>

        <Grid container spacing={40} >
          <Grid item xs={12} sm={12} md={12}>
            <p>bottom</p>
          </Grid>
        </Grid>
      </Grid>
    )

    const portfoliosArray = PortfolioStore.getAllPortfolios;

    return (
      <Grid container>
        {portfoliosArray.length > 0 ? summaryContent : createPortfolio}
      </Grid>
    );
  }
}

Summary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, summaryStyle)(Summary);
