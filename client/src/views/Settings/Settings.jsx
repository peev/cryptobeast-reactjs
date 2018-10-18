// @flow
import React from 'react';
import { Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import { RegularCard, ItemGrid } from './../../components';
import RegularButton from './../../components/CustomButtons/Button';
import CreatePortfolio from './../../components/Modal/CreatePortfolio';
import PortfoliosTable from './../../components/CustomTables/PortfoliosTable';
import TimeSettings from '../../components/Cards/TimeSettings';
import ApiIntegrations from './../../components/CustomTables/ApiIntegrations';
import AddApiAccount from './../../components/Modal/ApiAccountModals/AddApiAccount';
import NotificationSnackbar from '../../components/Modal/NotificationSnackbar';

import Weidex from './../../services/Weidex';


type Props = {
  MarketStore: {
    getSyncedSummaries: Function,
    getBaseCurrencies: Function,
  },
};

const Settings = inject('MarketStore')(observer(({ ...props }: Props) => {
  const getMarketSummaries = () => {
    props.MarketStore.getSyncedSummaries();
    props.MarketStore.getBaseCurrencies();
    props.MarketStore.syncMarketPriceHistory();
  };

  const syncData = () => {
    Weidex.sync({
      id: 'Test'
    });
    // TODO: Set loading or something
  };

  return (
    <Grid container>
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          cardTitle="API Integrations"
          button={<AddApiAccount />}
          content={
            <ApiIntegrations
              tableHead={['Exchange', 'Account', 'Status', 'Key', 'Secret', '']}
            />
          }
        />
      </ItemGrid>

      <ItemGrid xs={12} sm={12} md={12} style={{ margin: '50px 0' }}>
        <RegularCard
          cardTitle="Portfolios"
          button={<CreatePortfolio place="settings" />}
          content={
            <PortfoliosTable
              tableHead={[
                { id: 'name', numberic: false, disablePadding: false, label: 'Name' },
                { id: 'numShares', numberic: true, disablePadding: false, label: 'Number of Shares' },
                { id: 'sharePrice', numberic: true, disablePadding: false, label: 'Current share price' },
                { id: 'totalUSD', numberic: true, disablePadding: false, label: 'Total Amount' },
                { id: 'update', numberic: false, disablePadding: false, label: '' },
                { id: 'delete', numberic: false, disablePadding: false, label: '' },
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
        <RegularButton color="primary" onClick={() => getMarketSummaries()}>
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
