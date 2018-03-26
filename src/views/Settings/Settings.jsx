import React, { Component } from "react";
import { Grid, Button, Snackbar } from "material-ui";
import { RegularCard, ItemGrid, Table } from "components";
import { inject, observer } from "mobx-react";

import UpdatePortfolioModal from "../../components/Modal/UpdatePortfolio";
import RegularButton from "../../components/CustomButtons/Button";
import CreatePortfolio from "../../components/Modal/CreatePortfolio";

// import IconButton from '../../components/CustomButtons/IconButton';
// import CreatePortfolio from '../../components/Modal/CreatePortfolio';

@inject("MarketStore")
@observer
class Settings extends Component {
  state = {
    br: false
  };

  getMarketSummaries = () => {
    this.props.MarketStore.getMarketSummaries();
  };

  showNotification(place) {
    let x = [];
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
            content={
              <Table
                tableHeaderColor="primary"
                tableHead={["Exchange", "Status", "Edit", "Delete"]}
                tableData={[["Poloniex", "Inactive", "", ""]]}
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
                tableHead={[
                  "Name",
                  "Number of Shares",
                  "Current share price",
                  "Total Amount",
                  "Edit",
                  "Delete"
                ]}
                tableData={[["Poloniex", "Inactive", "test", "", ""]]}
              />
            }
          />
        </ItemGrid>

        <Grid container>
          <ItemGrid xs={12} sm={3} md={3}>
            <UpdatePortfolioModal />
          </ItemGrid>

          <ItemGrid xs={12} sm={3} md={3}>
            <RegularButton color="primary">Delete</RegularButton>
          </ItemGrid>

          <ItemGrid xs={12} sm={3} md={3}>
            <RegularButton color="primary" onClick={this.getMarketSummaries}>
              Get Markets
            </RegularButton>
          </ItemGrid>

          <ItemGrid xs={12} sm={3} md={3}>
            <Button
              fullWidth
              color="primary"
              onClick={() => this.showNotification("br")}
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
            <CreatePortfolio />
          </ItemGrid>
        </Grid>
      </Grid>
    );
  }
}

export default Settings;
