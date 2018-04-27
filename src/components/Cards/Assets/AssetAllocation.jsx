import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Input } from 'material-ui';
import Paper from 'material-ui/Paper';
import RegularButton from '../../CustomButtons/Button';
import SelectAllCurrency from '../../Selectors/Asset/SelectAllCurrency';
import SelectExchange from '../../Selectors/Asset/SelectExchange';
// import NotificationSnackbar from '../../Modal/NotificationSnackbar';
import { inject, observer } from 'mobx-react';

const styles = () => ({
  container: {
    width: '100%',
    margin: '40px 40px 0',
    padding: '20px 25px',
  },
  containerTitle: {
    margin: '0',
    fontSize: '16px',
    textTransform: 'uppercase',
  },
  containerItems: {
    marginTop: '1px',
  },
  containerButton: {
    paddingLeft: '8px',
  },
  btnAdd: {
    float: 'right',
    margin: '0',
  },
  input: {
    width: '100%',
  },
});

@inject('MarketStore')
@observer
class AssetAllocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      direction: 'row',
    };

    // this.handleExchangeAssetAllocation = this.handleExchangeAssetAllocation.bind(this);
  }

  componentWillUnmount() {
    this.props.MarketStore.resetAsset();
  }

  handleSave = () => {
    this.props.MarketStore.createAssetAllocation();
  }

  handleRequests = (type, event) => {
    const inputValue = event.target.value;
    this.props.MarketStore.setAssetAllocationValue(type, inputValue);
  }

  handleExchangeAssetAllocation = (value) => {
    this.props.MarketStore.selectExchangeAssetAllocation(value);
  }

  handleCurrencyFromAssetAllocation = (value) => {
    this.props.MarketStore.selectCurrencyFromAssetAllocation(value);
  }

  handleCurrencyToAssetAllocation = (value) => {
    this.props.MarketStore.selectCurrencyToAssetAllocation(value);
  }

  render() {
    const { classes, MarketStore } = this.props;

    return (
      <Grid container>
        <Paper className={classes.container}>
          <h4 className={classes.containerTitle}>Asset Allocation</h4>

          <Grid container className={classes.containerItems}>
            <Grid item xs={3}>
              <SelectExchange
                value={MarketStore.selectedExchangeAssetAllocation}
                handleChange={this.handleExchangeAssetAllocation}
              />
              <Input
                type="date"
                placeholder="Select Date"
                onChange={() => this.handleRequests('selectedDate')}
                className={classes.alignInput}
              />
            </Grid>

            <Grid item xs={3}>
              <SelectAllCurrency
                value={MarketStore.selectedCurrencyFromAssetAllocation}
                handleChange={this.handleCurrencyFromAssetAllocation}
              />
              <Input
                type="number"
                placeholder="QUANTITY..."
                className={classes.input}
              />
            </Grid>

            <Grid item xs={3}>
              <SelectAllCurrency
                value={MarketStore.selectedCurrencyToAssetAllocation}
                handleChange={this.handleCurrencyToAssetAllocation}
              />
              <Input
                type="number"
                placeholder="QUANTITY..."
                className={classes.input}
              />
            </Grid>

            <Grid item xs={3}>
              <SelectAllCurrency
                value={MarketStore.selectedCurrencyFromAssetAllocation}
                handleChange={this.handleCurrencyFromAssetAllocation}
              />
              <Input
                type="number"
                placeholder="QUANTITY..."
                className={classes.input}
              />
            </Grid>
          </Grid>

          <Grid container className={classes.containerButton}>
            <RegularButton color="primary" onClick={this.handleSave}>RECORD</RegularButton>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

AssetAllocation.propTypes = {
  classes: PropTypes.object.isRequired,
  MarketStore: PropTypes.object,
};

export default withStyles(styles)(AssetAllocation);
