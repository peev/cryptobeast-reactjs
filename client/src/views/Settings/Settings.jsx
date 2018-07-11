// @flow
import React from 'react';
import { Grid } from 'material-ui';
import { inject, observer } from 'mobx-react';

import { RegularCard, ItemGrid } from './../../components';
import RegularButton from './../../components/CustomButtons/Button';
import CreatePortfolio from './../../components/Modal/CreatePortfolio';
import PortfoliosTable from './../../components/CustomTables/PortfoliosTable';
import TimeSettings from '../../components/Cards/TimeSettings';
import ApiIntegrations from './../../components/CustomTables/ApiIntegrations';
import AddApiAccount from './../../components/Modal/ApiAccountModals/AddApiAccount';
import NotificationSnackbar from '../../components/Modal/NotificationSnackbar';


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

      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          cardTitle="Portfolios"
          button={<CreatePortfolio place="settings" />}
          content={
            <PortfoliosTable
              tableHead={[
                'Name',
                'Number of Shares',
                'Current share price',
                'Total Amount',
                '',
                '',
              ]}
            />
          }
        />
      </ItemGrid>

      <ItemGrid xs={12} sm={12} md={12}>
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

      <NotificationSnackbar />
    </Grid>
  );
}));

export default Settings;
