// @flow
import React from 'react';
import { Grid } from 'material-ui';
import { inject, observer } from 'mobx-react';

import { RegularCard, ItemGrid } from './../../components';
import RegularButton from './../../components/CustomButtons/Button';
import CreatePortfolio from './../../components/Modal/CreatePortfolio';
import PortfoliosTable from './../../components/CustomTables/PortfoliosTable';
import IntegrationsTable from './../../components/CustomTables/IntegrationsTable';
import AddApiAccount from './../../components/Modal/ApiAccountModals/AddApiAccount';


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
  };


  return (
    <Grid container>
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          cardTitle="API Integrations"
          button={<AddApiAccount />}
          content={
            <IntegrationsTable
              tableHead={['Exchange', 'Status', 'EDIT', 'DELETE']}
              tableData={[['Poloniex', 'Inactive', '', '']]}
            />
          }
        />
      </ItemGrid>

      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          cardTitle="Portfolios"
          button={<CreatePortfolio />}
          content={
            <PortfoliosTable
              tableHead={[
                'Name',
                'Number of Shares',
                'Current share price',
                'Total Amount',
                '',
              ]}
            />
          }
        />
      </ItemGrid>

      <ItemGrid xs={12} sm={3} md={3}>
        <RegularButton color="primary" onClick={getMarketSummaries()}>
          Get Markets
        </RegularButton>
      </ItemGrid>
    </Grid>
  );
}));

export default Settings;
