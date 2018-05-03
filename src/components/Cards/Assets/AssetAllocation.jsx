import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Input } from 'material-ui';
import Paper from 'material-ui/Paper';
import { inject, observer } from 'mobx-react';
import Select from 'react-select';
import { TextValidator, ValidatorForm, SelectValidator } from 'react-material-ui-form-validator';
import { MenuItem } from 'material-ui/Menu';

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
    marginTop: '21px',
  },
  alignInputAfter: {
    width: '100%',
    marginTop: '5px',
  },
  alignInputAfter2: {
    width: '100%',
    marginTop: '12px',
  },
  alignInputWidth: {
    width: '100%',
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
      this.props.NotificationStore.addMessage('successMessages', 'Successful asset allocation');
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
      this.props.AssetStore.selectCurrencyToAssetAllocation(input.target.value);
    } else {
      this.props.AssetStore.selectCurrencyToAssetAllocation('');
    }
  }

  handleCurrencyForTransactionFee = (input) => {
    if (input) {
      this.props.AssetStore.selectCurrencyForTransactionFee(input.target.value);
    } else {
      this.props.AssetStore.selectCurrencyForTransactionFee('');
    }
  }

  render() {
    const {
      classes, AssetStore, NotificationStore, MarketStore,
    } = this.props;

    const options = MarketStore.allCurrencies;
    const optionsToShow = [];

    options.forEach((element, i) => {
      optionsToShow.push((
        <MenuItem
          key={element.value}
          value={element.value}
          index={i}
        >
          <em>{element.label}</em>
        </MenuItem>
      ));
    });

    return (
      <Grid container>
        <Paper className={classes.container}>
          <h4 className={classes.containerTitle}>Asset Allocation</h4>
          <ValidatorForm
            onSubmit={this.handleSave}
          >
            <Grid container className={classes.containerItems}>
              <Grid item xs={3}>
                <SelectExchange
                  label="Select Exchange (optional)"
                  value={AssetStore.selectedExchangeAssetAllocation}
                  handleChange={this.handleExchangeAssetAllocation}
                />
                <TextValidator
                  name="date"
                  type="date"
                  // label="Select Date"
                  className={classes.alignInput}
                  value={AssetStore.assetAllocationSelectedDate}
                  onChange={this.handleRequests('assetAllocationSelectedDate')}
                  validators={['required']}
                  errorMessages={['this field is required']}
                />
              </Grid>

              <Grid item xs={3}>
                <SelectPortfolioCurrency />
                <TextValidator
                  name="quantity2"
                  type="number"
                  label="Quantity..."
                  value={AssetStore.assetAllocationFromAmount}
                  className={classes.alignInputAfter}
                  onChange={this.handleRequests('assetAllocationFromAmount')}
                  validators={['required']}
                  errorMessages={['this field is required']}
                />
              </Grid>

              <Grid item xs={3}>
                <SelectValidator
                  label="Select Currency"
                  name="currency-to-asset-allocation"
                  value={AssetStore.selectedCurrencyToAssetAllocation}
                  onChange={this.handleCurrencyToAssetAllocation}
                  options={MarketStore.allCurrencies}
                  className={classes.alignInputWidth}
                  validators={['required']}
                  errorMessages={['this field is required']}
                >
                  {optionsToShow}
                </SelectValidator>
                <TextValidator
                  name="quantity3"
                  type="number"
                  label="Quantity..."
                  className={classes.alignInputAfter}
                  value={AssetStore.assetAllocationToAmount}
                  onChange={this.handleRequests('assetAllocationToAmount')}
                  validators={['required']}
                  errorMessages={['this field is required']}
                />
              </Grid>

              <Grid item xs={3}>
                <SelectValidator
                  label="Transaction Fee (optional)"
                  name="currency-for-asset-fee"
                  value={AssetStore.selectedCurrencyForTransactionFee}
                  onChange={this.handleCurrencyForTransactionFee}
                  // options={MarketStore.allCurrencies}
                  className={classes.alignInputWidth}
                  validators={['required']}
                  errorMessages={['this field is required']}
                >
                  {optionsToShow}
                </SelectValidator>
                <TextValidator
                  name="fee"
                  label="Quantity"
                  type="number"
                  placeholder="Quantity..."
                  className={classes.alignInputAfter2}
                  value={AssetStore.assetAllocationFee}
                  onChange={this.handleRequests('assetAllocationFee')}
                  validators={['required', 'maxNumber:100']}
                  errorMessages={['this field is required', 'must be a number between 0 and 100']}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <RegularButton
                  type="submit"
                  color="primary"
                  className={classes.btnAdd}
                  // onClick={this.handleSave}
                  disabled={NotificationStore.getErrorsLength > 0}
                >RECORD
                </RegularButton>
              </Grid>
            </Grid>
          </ValidatorForm>
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
