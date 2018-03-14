import React from 'react';
import { Grid } from 'material-ui';
import { RegularCard, ItemGrid, Table } from 'components';
import IconButton from '../../components/CustomButtons/IconButton';

const Settings = ({ ...props }) => {
  return (
    <Grid container>
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          cardTitle="API Integrations"
          content={
            <Table
              tableHeaderColor="primary"
              tableHead={['Exchange', 'Status', 'Edit', 'Delete']}
              tableData={[
                ['Poloniex', 'Inactive', '', ''],
              ]}
            />
          }
        />
      </ItemGrid>
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          cardTitle="Portfolios"
          content={
            <Table
              tableHeaderColor="primary"
              tableHead={['Name', 'Number of Shares', 'Current share price', 'Total Amount', 'Edit', 'Delete']}
              tableData={[
                ['Poloniex', 'Inactive', 'test','', ''],
              ]}

            />
          }
        />
      </ItemGrid>
    </Grid>
  );

};

export default Settings;
