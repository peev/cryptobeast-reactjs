import React from 'react';
import PropTypes from 'prop-types';
// react plugin for creating charts
import ChartistGraph from 'react-chartist';
import {
  ContentCopy,
  Store,
  InfoOutline,
  Warning,
  DateRange,
  LocalOffer,
  Update,
  ArrowUpward,
  AccessTime,
  Accessibility,
} from 'material-ui-icons';
import { withStyles, Grid } from 'material-ui';

import {
  StatsCard,
  ChartCard,
  TasksCard,
  RegularCard,
  Table,
  ItemGrid,
} from 'components';

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from 'variables/charts';

import summaryStyle from 'variables/styles/summaryStyle';

import { inject, observer } from 'mobx-react';

import CreatePortfolio from '../../components/Modal/CreatePortfolio';

import AddInvestorWrapped from '../../components/Modal/InvestorModals/AddInvestor';

import './Summary.css';

@inject('PortfolioStore')
@observer
class Summary extends React.Component {
  state = {
    value: 0,
    inputName: '',
  };

  getProductsHandler = () => {
    // HTTP call to api
    // axios.get('http://localhost:3200/todos')
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // console.log('getProductsHandler', ipcRenderer);

    // // trigger call to electron
    // ipcRenderer.send('getProductsCall');

    // // listen for callback from electron
    // ipcRenderer.on('getProductsReturn', (event, result) => {
    //   console.log('getProductsReturn', event);
    //   console.log('getProductsReturn', result);
    // });
  }

  getLocationHandler = () => {
    // console.log('getLocationHandler', ipcRenderer);

    // // trigger call to electron
    // ipcRenderer.send('getLocationCall');

    // // listen for callback from electron
    // ipcRenderer.on('getLocationReturn', (event, result) => {
    //   console.log('getLocationReturn', event);
    //   console.log('getLocationReturn', result);
    // });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };

  //  event handler test
  addToProductsHandler = (event) => {
    // if (event.key === 'Enter') {
    //   console.log('do validate');
    //   console.log(event.target.value);
    //   this.setState({ inputName: event.target.value });

    //   // trigger call to electron
    //   const price = Math.floor((Math.random() * (1000 - (500 + 1))) + 500);
    //   const name = event.target.value;
    //   const objectToSave = {
    //     name,
    //     price,
    //   };
    //   console.log(objectToSave);
    //   console.log(this.state.inputName);
    //   ipcRenderer.send('addToProductsCall', objectToSave);

    //   // listen for callback from electron
    //   ipcRenderer.on('addToProductsReturn', (ev, result) => {
    //     console.log('addToProductsReturn', ev);
    //     console.log('addToProductsReturn', result);
    //   });

    //   console.log(this.state.inputName);
    // }
  }

  render() {
    const { PortfolioStore } = this.props;
    let createPortfolio;
    let other;

    if (!PortfolioStore.portfolios.hasOwnProperty('0')) {
      createPortfolio = (
        <div className="createPortfolio">
          <p>You currently have no portfolio to display. Please create a portfolio to start</p>
          <CreatePortfolio />
        </div>
      )
    } else {
      other = <p>Summary is working</p>
    }

    return (
      <div className="Summary">
        <Grid >
          {createPortfolio}
          {other}
          {/* <AddInvestorWrapped /> */}
        </Grid>
      </div>
    );
  }
}

Summary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(summaryStyle)(Summary);
