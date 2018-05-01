import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Input } from 'material-ui';
import Paper from 'material-ui/Paper';
import { inject, observer } from 'mobx-react';
import Select from 'react-select';

import RegularButton from '../../CustomButtons/Button';
import SelectExchange from '../../Selectors/Asset/SelectExchange';
import SelectPortfolioCurrency from '../../Selectors/Asset/SelectPortfolioCurrency';
import '../../Selectors/Asset/SelectAllCurrency';

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
  btnAdd: {
    float: 'right',
    margin: '0',
  },
  alignInput: {
    width: '100%',
    marginTop: '12px',
  },
  alignInputAfter: {
    width: '100%',
    marginTop: '5px',
  },
});

@inject('AssetStore', 'NotificationStore', 'MarketStore')
@observer
class AssetAllocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      direction: 'row',
    };
  }

  componentWillUnmount() {
    this.props.AssetStore.resetAsset();
  }

  handleSave = () => {
    const { AssetStore } = this.props;
    const hasErrors = AssetStore.handleAssetAllocationErrors();

    if (hasErrors) {
      AssetStore.createAssetAllocation();

      AssetStore.resetAssetAllocation();
    }
  }

  handleRequests = type => (event) => {
    event.preventDefault();
    const inputValue = event.target.value;

    this.props.AssetStore.setAssetAllocationValue(type, inputValue);
  }

  handleExchangeAssetAllocation = (value) => {
    this.props.AssetStore.selectExchangeAssetAllocation(value);
  }

  handleCurrencyToAssetAllocation = (input) => {
    if (input) {
      this.props.AssetStore.selectCurrencyToAssetAllocation(input.value);
    } else {
      this.props.AssetStore.selectCurrencyToAssetAllocation('');
    }
  }

  handleCurrencyForTransactionFee = (input) => {
    if (input) {
      this.props.AssetStore.selectCurrencyForTransactionFee(input.value);
    } else {
      this.props.AssetStore.selectCurrencyForTransactionFee('');
    }
  }

  render() {
    const { classes, AssetStore, NotificationStore, MarketStore } = this.props;

    return (
      <Grid container>
        <Paper className={classes.container}>
          <h4 className={classes.containerTitle}>Asset Allocation</h4>

          <Grid container className={classes.containerItems}>
            <Grid item xs={3}>
              <SelectExchange
                value={AssetStore.selectedExchangeAssetAllocation}
                handleChange={this.handleExchangeAssetAllocation}
              />
              <Input
                type="date"
                placeholder="Select Date"
                className={AssetStore.selectedExchangeAssetAllocation === '' ?
                  classes.alignInputAfter :
                  classes.alignInput}
                value={AssetStore.assetAllocationSelectedDate}
                onChange={this.handleRequests('assetAllocationSelectedDate')}
              />
            </Grid>

            <Grid item xs={3}>
              <SelectPortfolioCurrency />
              <Input
                type="number"
                placeholder="Quantity..."
                value={AssetStore.assetAllocationFromAmount}
                className={AssetStore.selectedCurrencyFromAssetAllocation === '' ?
                  classes.alignInputAfter :
                  classes.alignInput}
                onChange={this.handleRequests('assetAllocationFromAmount')}
              />
            </Grid>

            <Grid item xs={3}>
              <Select
                name="currency-to-asset-allocation"
                value={AssetStore.selectedCurrencyToAssetAllocation}
                onChange={this.handleCurrencyToAssetAllocation}
                options={MarketStore.allCurrencies}
                className={classes.alignInput}
                style={{
                  border: 'none',
                  borderRadius: 0,
                  borderBottom: '1px solid #757575',
                }}
              />
              <Input
                type="number"
                placeholder="Quantity..."
                className={classes.alignInput}
                value={AssetStore.assetAllocationToAmount}
                onChange={this.handleRequests('assetAllocationToAmount')}
              />
            </Grid>

            <Grid item xs={3}>
              <Select
                name="currency-for-asset-fee"
                value={AssetStore.selectedCurrencyForTransactionFee}
                onChange={this.handleCurrencyForTransactionFee}
                options={MarketStore.allCurrencies}
                className={classes.alignInput}
                style={{
                  border: 'none',
                  borderRadius: 0,
                  borderBottom: '1px solid #757575',
                }}
              />
              <Input
                type="number"
                placeholder="Quantity..."
                className={classes.alignInput}
                value={AssetStore.assetAllocationFee}
                onChange={this.handleRequests('assetAllocationFee')}
              />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12}>
              <RegularButton
                color="primary"
                className={classes.btnAdd}
                onClick={this.handleSave}
                disabled={NotificationStore.getErrorsLength > 0}
              >RECORD
              </RegularButton>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

AssetAllocation.propTypes = {
  classes: PropTypes.object.isRequired,
  AssetStore: PropTypes.any,
  MarketStore: PropTypes.any,
  NotificationStore: PropTypes.object,
};

export default withStyles(styles)(AssetAllocation);
