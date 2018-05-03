import React, { Component } from 'react';
import { Grid, Button, Snackbar } from 'material-ui';
import { RegularCard, ItemGrid } from 'components';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';


// import UpdatePortfolioModal from '../../components/Modal/UpdatePortfolio';
import RegularButton from '../../components/CustomButtons/Button';
import CreatePortfolio from '../../components/Modal/CreatePortfolio';
import PortfoliosTable from '../../components/CustomTables/PortfoliosTable';
import IntegrationsTable from '../../components/CustomTables/IntegrationsTable';

import AddApiAccount from '../../components/Modal/ApiAccountModals/AddApiAccount';

// import IconButton from '../../components/CustomButtons/IconButton';
// import CreatePortfolio from '../../components/Modal/CreatePortfolio';

@inject('MarketStore')
@observer
class Settings extends Component {
  state = {
    br: false,
  };

  getMarketSummaries = () => {
    this.props.MarketStore.getSyncedSummaries();
    this.props.MarketStore.getBaseCurrencies();
  };

  showNotification(place) {
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

Settings.propTypes = {
  MarketStore: PropTypes.object,
};

export default Settings;
