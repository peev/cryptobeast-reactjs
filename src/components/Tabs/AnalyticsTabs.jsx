import React from "react";
import SwipeableViews from "react-swipeable-views";
import Paper from 'material-ui/Paper';
import {
  Tabs,
  Tab,
  TabScrollButton,
  withStyles,
  Typography,
  Grid,
} from "material-ui";
import Volatility from './TabItems/Volatility';

class AnalyticsTabs extends React.Component {
  state = {
    value: null,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Tabs 
        value={this.state.value}
        onChange={this.handleChange}>
          <Tab label="Performance" value={this.value} />
          <Tab label="Volatility/Risk" />
          <Tab label="Profit/Loss" />
          <Tab label="Liquidity" />
          <Tab label="Correlation matrix" />
        </Tabs>
        <br />
        
        <SwipeableViews
          index={this.state.value}
          onChange={this.handleChange}
        >
          
          <div>
            <h2>Here's one more!</h2>
          </div>
          <Volatility />
          <div>
            <h2>Here's another one!</h2>
          </div>

          <div>
            <h2>Here's one more again!</h2>
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

export default withStyles()(AnalyticsTabs);
