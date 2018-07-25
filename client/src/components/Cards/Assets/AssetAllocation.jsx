// @flow
import React from 'react';
import { withStyles, Grid } from 'material-ui';
import Paper from 'material-ui/Paper';
import { inject, observer } from 'mobx-react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Select from 'react-select';

import ClickablePopup from '../../Modal/ClickablePopup';
import RegularButton from '../../CustomButtons/Button';
import SelectExchange from '../../Selectors/Asset/SelectExchange';
import SelectPortfolioCurrency from '../../Selectors/Asset/SelectPortfolioCurrency';
import '../../Selectors/Asset/SelectAllCurrency';

const styles = () => ({
  container: {
    width: '100%',
    padding: '20px 25px',
    margin: '50px 0',
  },
  containerTitle: {
    margin: '0',
    fontSize: '16px',
    textTransform: 'uppercase',
  },
  containerItems: {
  },
  btnAdd: {
    float: 'right',
    margin: '0',
  },
  alignInput: {
    width: '95%',
    marginTop: '25px',
  },
  alignInputAfter: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
    width: '95%',
    marginTop: '5px',
  },
  alignInputAfter2: {
    width: '95%',
    marginTop: '12px',
  },
  alignInputWidth: {
    width: '95%',
  },
  popOverContainer: {
    display: 'flex',
    position: 'relative',
  },
  popOverButton: {
    position: 'absolute',
    right: '20px',
  },
  numberInputArrows: {
    '& input, & label': {
      paddingLeft: '10px',
      paddingRight: '10px',
    },
    '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
      display: 'none',
    },
  },
  dateInputArrows: {
    '& input': {
      paddingLeft: '10px',
      paddingRight: '6px',
    },
    '& input[type=date]::-webkit-inner-spin-button, & input[type=date]::-webkit-outer-spin-button': {
      display: 'none',
    },
    '& input[type=date]::-webkit-clear-button': {
      position: 'relative',
      right: '10px',
      cursor: 'pointer',
    },
    '& input[type=date]::-webkit-calendar-picker-indicator': {
      color: '#999',
      width: '10px',
      fontSize: '11px',
      '&:hover': {
        backgroundColor: '#fff',
        color: '#555',
        cursor: 'pointer',
      },
    },
  },
});

type Props = {
  classes: Object,
  AssetStore: Object,
  MarketStore: Object,
  PortfolioStore: Object,
};

@inject('AssetStore', 'MarketStore', 'PortfolioStore')
@observer
class AssetAllocation extends React.Component<Props> {
  componentWillUnmount() {
    this.props.AssetStore.resetAsset();
  }

  handleSave = () => {
    const { AssetStore } = this.props;

    AssetStore.createTradeAssetAllocation();
  }

  handleRequests = (type: *) => (event: SyntheticInputEvent) => {
    event.preventDefault();
    const inputValue = event.target.value;
    this.props.AssetStore.setAssetAllocationValue(type, inputValue);
  }

  handleExchangeAssetAllocation = (value: any) => {
    this.props.AssetStore.selectExchangeAssetAllocation(value);
  }

  handleCurrencyToAssetAllocation = (input: Object) => {
    if (input) {
      this.props.AssetStore.selectCurrencyToAssetAllocation(input.value);
    } else {
      this.props.AssetStore.selectCurrencyToAssetAllocation('');
    }
  }

  handleCurrencyForTransactionFee = (input: Object) => {
    if (input) {
      this.props.AssetStore.selectCurrencyForTransactionFee(input.value);
    } else {
      this.props.AssetStore.selectCurrencyForTransactionFee('');
    }
  }

  render() {
    const {
      classes,
      AssetStore,
      MarketStore,
      PortfolioStore,
    } = this.props;
    const today = new Date().toISOString().substring(0, 10);
    const { allCurrenciesCombined } = MarketStore;

    return (
      <Grid container>
        <Paper className={classes.container}>
          <h4 className={classes.containerTitle}>Asset Allocation</h4>
          <ValidatorForm
            onSubmit={this.handleSave}
          >
            <Grid container className={classes.containerItems}>
              <Grid item xs={12} sm={6} md={3}>
                <SelectExchange
                  label="Select Exchange (optional)"
                  value={AssetStore.selectedExchangeAssetAllocation}
                  handleChange={this.handleExchangeAssetAllocation}
                  style={{
                    marginTop: '12px',
                    width: '95%',
                    border: 'none',
                    borderRadius: 0,
                    borderBottom: '1px solid #757575',
                  }}
                />
                <TextValidator
                  name="date"
                  type="date"
                  style={{ marginTop: '21px', width: '95%' }}
                  value={AssetStore.assetAllocationSelectedDate || today}
                  onChange={this.handleRequests('assetAllocationSelectedDate')}
                  validators={['required']}
                  errorMessages={['this field is required']}
                  className={classes.dateInputArrows}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <div className={classes.popOverContainer}>
                  <SelectPortfolioCurrency />

                  {PortfolioStore.currentPortfolioAssets.length === 0
                    ? <ClickablePopup />
                    : ''}
                </div>

                <TextValidator
                  name="quantity2"
                  type="number"
                  label="Quantity*"
                  value={AssetStore.assetAllocationFromAmount}
                  className={`${classes.alignInputAfter} ${classes.numberInputArrows}`}
                  onChange={this.handleRequests('assetAllocationFromAmount')}
                  validators={['required', 'isPositive']}
                  errorMessages={['this field is required', 'value must be a positive number']}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Select
                  placeholder="Bought or received*"
                  name="currency-to-asset-allocation"
                  value={AssetStore.selectedCurrencyToAssetAllocation}
                  onChange={this.handleCurrencyToAssetAllocation}
                  options={allCurrenciesCombined}
                  className={classes.alignInputAfter2}
                  style={{
                    border: 'none',
                    borderRadius: 0,
                    borderBottom: '1px solid #757575',
                  }}
                />
                <TextValidator
                  name="quantity3"
                  type="number"
                  label="Quantity*"
                  className={`${classes.alignInputAfter} ${classes.numberInputArrows}`}
                  value={AssetStore.assetAllocationToAmount}
                  onChange={this.handleRequests('assetAllocationToAmount')}
                  validators={['required', 'isPositive']}
                  errorMessages={['this field is required', 'value must be a positive number']}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Select
                  placeholder="Transaction Fee (optional)"
                  name="currency-for-asset-fee"
                  value={AssetStore.selectedCurrencyForTransactionFee}
                  onChange={this.handleCurrencyForTransactionFee}
                  options={allCurrenciesCombined}
                  className={classes.alignInputAfter2}
                  style={{
                    border: 'none',
                    borderRadius: 0,
                    borderBottom: '1px solid #757575',
                  }}
                />
                <TextValidator
                  name="fee"
                  type="number"
                  label="Quantity"
                  className={`${classes.alignInputAfter} ${classes.numberInputArrows}`}
                  value={AssetStore.assetAllocationFee}
                  onChange={this.handleRequests('assetAllocationFee')}
                  validators={['isPositive', 'maxNumber:100']}
                  errorMessages={['value must be a positive number', 'must be a number between 0 and 100']}
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
                  disabled={AssetStore.assetAllocationToAmount === ''
                    || AssetStore.selectedCurrencyToAssetAllocation === ''
                    || AssetStore.assetAllocationFromAmount === ''
                    || AssetStore.selectedCurrencyFromAssetAllocation === ''}
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

export default withStyles(styles)(AssetAllocation);
