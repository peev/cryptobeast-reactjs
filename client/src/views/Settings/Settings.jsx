// @flow
import React from 'react';
import { Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import { RegularCard, ItemGrid } from './../../components';
import RegularButton from './../../components/CustomButtons/Button';
import PortfoliosTable from './../../components/CustomTables/PortfoliosTable';
import TimeSettings from '../../components/Cards/TimeSettings';
import NotificationSnackbar from '../../components/Modal/NotificationSnackbar';
import storage from '../../services/storage';

type Props = {
  MarketStore: {
    getTickersFromCoinMarketCap: Function,
  },
  PortfolioStore: Object,
};

const Settings = inject('MarketStore', 'PortfolioStore')(observer(({ ...props }: Props) => {
  const getTickersFromCoinMarketCap = () => {
    props.MarketStore.getTickersFromCoinMarketCap();
  };

  const syncData = () => {
    storage.getPortfolioAddresses()
      .then((data: Array<string>) => props.PortfolioStore.sync(data));
  };

  return (
    <Grid container>
      <ItemGrid xs={12} sm={12} md={12} style={{ margin: '0 0 50px 0' }}>
        <RegularCard
          cardTitle="Portfolios"
          content={
            <PortfoliosTable
              portfolios={props.PortfolioStore.allPortfoliosData}
              tableHead={[
                { id: 'name', numberic: false, disablePadding: false, label: 'Name' },
                { id: 'numShares', numberic: true, disablePadding: false, label: 'Number of Shares' },
                { id: 'sharePrice', numberic: true, disablePadding: false, label: 'Current share price' },
                { id: 'totalUSD', numberic: true, disablePadding: false, label: 'Total Amount' },
                { id: 'update', numberic: false, disablePadding: false, label: 'Action' },
              ]}
            />
          }
        />
      </ItemGrid>

      <ItemGrid xs={12} sm={12} md={12} style={{ marginBottom: '20px' }}>
        <RegularCard
          cardTitle="Time Settings"
          content={<TimeSettings />}
        />
      </ItemGrid>

      <ItemGrid xs={12} sm={3} md={3}>
        <RegularButton color="primary" onClick={() => getTickersFromCoinMarketCap()}>
          Get Markets
        </RegularButton>
      </ItemGrid>

      <ItemGrid xs={12} sm={3} md={3}>
        <RegularButton color="primary" onClick={() => syncData()}>
          Sync data
        </RegularButton>
      </ItemGrid>

      <NotificationSnackbar />
    </Grid>
  );
}));

export default Settings;
