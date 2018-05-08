// @flow
import React, { Component } from 'react';
import { Grid, Button, Snackbar } from 'material-ui';
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

type State = {
  br: boolean,
};

@inject('MarketStore')
@observer
class Settings extends Component<Props, State> {
  state = {
    br: false,
  };

  getMarketSummaries = () => {
    this.props.MarketStore.getSyncedSummaries();
    this.props.MarketStore.getBaseCurrencies();
  };

  showNotification(place: string) {
    const x = [];
    x[place] = true;
    this.setState(x);
    setTimeout(() => {
      x[place] = false;
      this.setState(x);
    }, 6000);
  }

  render() {
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
                // tableData={[
                //   ["Poloniex", "Inactive", "test", "test", ""],
                //   ["Poloniex", "Inactive", "test", "test", ""],
                //   ["Poloniex", "Inactive", "test", "test", ""],
                //   ["Poloniex", "Inactive", "test", "test", ""]
                // ]}
              />
            }
          />
        </ItemGrid>

        <Grid container>
          <ItemGrid xs={12} sm={3} md={3}>
            <RegularButton color="primary" onClick={this.getMarketSummaries}>
              Get Markets
            </RegularButton>
          </ItemGrid>

          <ItemGrid xs={12} sm={3} md={3}>
            <Button
              fullWidth
              color="primary"
              onClick={() => this.showNotification('br')}
            >
              Bottom Right Notification
            </Button>

            <Snackbar
              place="br"
              color="info"
              message="This is a warning Message"
              open={this.state.br}
              closeNotification={() => this.setState({ br: false })}
              close
            />
          </ItemGrid>
        </Grid>
      </Grid>
    );
  }
}

export default Settings;
