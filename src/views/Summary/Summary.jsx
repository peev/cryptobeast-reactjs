import React from "react";
import PropTypes from "prop-types";
import { withStyles, Grid } from "material-ui";
import summaryStyle from "variables/styles/summaryStyle";

import { inject, observer } from "mobx-react";
import CreatePortfolio from "../../components/Modal/CreatePortfolio";
import "./Summary.css";
// react plugin for creating charts
// import ChartistGraph from 'react-chartist';
// import {
//   ContentCopy, Store, InfoOutline, Warning, DateRange, LocalOffer, Update, ArrowUpward, AccessTime, Accessibility,
// } from 'material-ui-icons';
// import {
//   StatsCard,
//   ChartCard,
//   TasksCard,
//   RegularCard,
//   Table,
//   ItemGrid,
// } from 'components';
// import {
//   dailySalesChart,
//   emailsSubscriptionChart,
//   completedTasksChart,
// } from 'variables/charts';
// import AddInvestorWrapped from '../../components/Modal/InvestorModals/AddInvestor';

@inject("PortfolioStore")
@observer
class Summary extends React.Component {
  state = {
    value: 0,
    inputName: ""
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { PortfolioStore } = this.props;
    let createPortfolio;
    let summaryContent;

    if (!PortfolioStore.portfolios.hasOwnProperty("0")) {
      createPortfolio = (
        <div className="createPortfolio">
          <p>
            You currently have no portfolio to display. Please create a
            portfolio to start
          </p>
          <CreatePortfolio />
        </div>
      );
    } else {
      summaryContent = <p>Summary is working</p>;
    }

    return (
      <div className="Summary">
        <Grid>
          <CreatePortfolio />
          {createPortfolio}
          {summaryContent}
          {/* <AddInvestorWrapped /> */}
        </Grid>
      </div>
    );
  }
}

Summary.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(summaryStyle)(Summary);
