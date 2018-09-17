import React from 'react';
import { Grid } from '@material-ui/core';
import AssetInput from './../../components/Cards/Assets/AssetInput';
import AssetAllocation from './../../components/Cards/Assets/AssetAllocation';
import PortfolioSummaryTable from './../../components/CustomTables/PortfolioSummaryTable';

const AssetMovements = () => (
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
          { id: 'ticker', numberic: false, disablePadding: false, label: 'Ticker' },
          { id: 'holdings', numberic: true, disablePadding: false, label: 'Holdings' },
          { id: 'priceBTC', numberic: true, disablePadding: false, label: 'Price (BTC)' },
          { id: 'priceUSD', numberic: true, disablePadding: false, label: 'Price (USD)' },
          { id: 'totalUSD', numberic: true, disablePadding: false, label: 'Total Value (USD)' },
          { id: 'assetWeight', numberic: false, disablePadding: false, label: 'Asset Weight' },
          { id: '24Change', numberic: true, disablePadding: false, label: '24H Change' },
          { id: '7Change', numberic: true, disablePadding: false, label: '7D Change' },
        ]}
      />
    </Grid>
  </Grid>
);

export default AssetMovements;
