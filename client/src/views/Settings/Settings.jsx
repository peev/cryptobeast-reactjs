// @flow
import React from 'react';
import { Grid } from 'material-ui';
import { inject, observer } from 'mobx-react';

import { RegularCard, ItemGrid } from './../../components';
import RegularButton from './../../components/CustomButtons/Button';
import CreatePortfolio from './../../components/Modal/CreatePortfolio';
import PortfoliosTable from './../../components/CustomTables/PortfoliosTable';
import TimeSettings from '../../components/Cards/TimeSettings';
import IntegrationsTable from './../../components/CustomTables/IntegrationsTable';
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
            <IntegrationsTable
              tableHead={['Exchange', 'Status', 'Key', 'Secret', '']}
              tableData={[
                ['Poloniex',
                  'Inactive',
                  'b38c243abc1f41d6b238f563610d74dc',
                  '941ecbcd752d4a4eb9e684625919d382',
                  ''],
                ['Bittrex',
                  'Active',
                  'ad720e1be39f437280efe61bddbe07d6',
                  'aae3dfa80b614af3b50aef34908693df',
                  ''],
                ['Kraken',
                  'Active',
                  '1de4e0b2ac254df4989670016a093c9c',
                  '46fe9499d0aa47adbc0f2a7193c5089c',
                  ''],
              ]}
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
