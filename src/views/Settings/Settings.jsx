import React, { Component } from 'react';
import { Grid } from 'material-ui';
import { RegularCard, ItemGrid, Table } from 'components';
import { inject, observer } from 'mobx-react';

import UpdatePortfolioModal from '../../components/Modal/UpdatePortfolio';
import RegularButton from '../../components/CustomButtons/Button';

// import IconButton from '../../components/CustomButtons/IconButton';
// import CreatePortfolio from '../../components/Modal/CreatePortfolio';


@inject('MarketStore')
@observer
class Settings extends Component {

  getMarketSummaries = () => {
    this.props.MarketStore.getMarketSummaries();
  }

  render() {
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

          <div>
            <RegularButton
              color="primary"
              onClick={this.getMarketSummaries}
            >
              Get Markets
            </RegularButton>
          </div>
        </ItemGrid>
      </Grid >
    );
  }
}

export default Settings;
