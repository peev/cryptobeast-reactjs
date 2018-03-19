import React from 'react';
import { Grid } from 'material-ui';
import { RegularCard, ItemGrid, Table } from 'components';
import UpdatePortfolioModal from '../../components/Modal/UpdatePortfolio';
import RegularButton from '../../components/CustomButtons/Button';

// import IconButton from '../../components/CustomButtons/IconButton';
// import CreatePortfolio from '../../components/Modal/CreatePortfolio';

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
                ['Poloniex', 'Inactive', 'test', '', ''],
              ]}

            />
          }
        />
      </ItemGrid>
      <ItemGrid xs={12} sm={12} md={12}>
        <UpdatePortfolioModal />
        <div>
          <RegularButton color="primary" >
            Delete
          </RegularButton>
        </div>
      </ItemGrid>
    </Grid>
  );
};

export default Settings;
