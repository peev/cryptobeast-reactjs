import React from 'react';
import { Grid } from 'material-ui';
import AssetInput from '../../components/Cards/Assets/AssetInput';
import AssetAllocation from '../../components/Cards/Assets/AssetAllocation';
import AssetsTable from '../../components/CustomTables/AssetsTable';
import PortfolioSummaryTable from '../../components/CustomTables/PortfolioSummaryTable';

class AssetMovements extends React.Component {
  state = {
    direction: 'row',
  };

  render() {
    return (
      <div>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <AssetInput />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <AssetAllocation />
          </Grid>
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
      </div>
    );
  }
}

export default AssetMovements;
