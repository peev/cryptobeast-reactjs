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
import DropDownArrow from '../../CustomIcons/DropDown/DropDownArrow';


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
  gridContainer: {
    margin: '20px -20px',
  },
  gridItemPadding: {
    padding: '0 20px',
  },
  popOverContainer: {
    display: 'flex',
    position: 'relative',
    top: '-12px',
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
      paddingRight: '16px',
    },
    '& input[type=date]::-webkit-inner-spin-button, & input[type=date]::-webkit-outer-spin-button': {
      display: 'none',
    },
    '& input[type=date]::-webkit-clear-button': {
      display: 'none',
    },
    '& input[type=date]::-webkit-calendar-picker-indicator': {
      position: 'relative',
      fontSize: '12px',
      top: '-3px',
      padding: '1px',
      color: 'transparent',
      border: 'solid #999',
      borderWidth: '0 1px 1px 0',
      transform: 'rotate(45deg)',
      '&:hover': {
        backgroundColor: '#fff',
        cursor: 'pointer',
      },
    },
  },
  select: {
    '& .Select-placeholder': {
      top: '2px',
    },
    '& .Select-placeholder:hover': {
      borderBottom: '1px solid #000',
    },
    '& .Select-clear': {
      position: 'relative',
      top: '2px',
      right: '5px',
    },
    '& .Select-arrow-zone svg': {
      fontSize: '15px',
      paddingRight: '8px',
      position: 'relative',
      top: '4px',
    },
  },
  selectArrowAnimation: {
    '& .is-open > .Select-control .Select-arrow-zone svg': {
      position: 'relative',
      left: '-8px',
      transform: 'rotate(180deg)',
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

  arrowRenderer = () => (
    <DropDownArrow />
  );

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
            <div className={classes.gridContainer}>
              <Grid container className={classes.containerItems}>
                <Grid item xs={12} md={6} lg={3} className={classes.gridItemPadding}>
                  <SelectExchange
                    label="Select Exchange (optional)"
                    value={AssetStore.selectedExchangeAssetAllocation}
                    handleChange={this.handleExchangeAssetAllocation}
                    style={{
                      border: 'none',
                      borderRadius: 0,
                      borderBottom: '1px solid #757575',
                    }}
                  />

                  <TextValidator
                    name="date"
                    type="date"
                    value={AssetStore.assetAllocationSelectedDate || today}
                    onChange={this.handleRequests('assetAllocationSelectedDate')}
                    validators={['required']}
                    errorMessages={['this field is required']}
                    style={{ marginTop: '31px', width: '100%' }}
                    className={classes.dateInputArrows}
                  />
                </Grid>

                <Grid item xs={12} md={6} lg={3} className={classes.gridItemPadding}>
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
                    className={classes.numberInputArrows}
                    onChange={this.handleRequests('assetAllocationFromAmount')}
                    validators={['required', 'isPositive']}
                    errorMessages={['this field is required', 'value must be a positive number']}
                    style={{ width: '100%', position: 'relative', top: '-12px', marginTop: '15px' }}
                  />
                </Grid>

                <Grid item xs={12} md={6} lg={3} className={`${classes.selectArrowAnimation} ${classes.gridItemPadding}`}>
                  <Select
                    placeholder="Bought or received*"
                    name="currency-to-asset-allocation"
                    value={AssetStore.selectedCurrencyToAssetAllocation}
                    onChange={this.handleCurrencyToAssetAllocation}
                    options={allCurrenciesCombined}
                    style={{
                      border: 'none',
                      borderRadius: 0,
                      borderBottom: '1px solid #757575',
                    }}
                    arrowRenderer={this.arrowRenderer}
                    className={classes.select}
                  />
                  <TextValidator
                    name="quantity3"
                    type="number"
                    label="Quantity*"
                    className={classes.numberInputArrows}
                    value={AssetStore.assetAllocationToAmount}
                    onChange={this.handleRequests('assetAllocationToAmount')}
                    validators={['required', 'isPositive']}
                    errorMessages={['this field is required', 'value must be a positive number']}
                    style={{ width: '100%', marginTop: '15px' }}
                  />
                </Grid>

                <Grid item xs={12} md={6} lg={3} className={`${classes.selectArrowAnimation} ${classes.gridItemPadding}`}>
                  <Select
                    placeholder="Transaction Fee (optional)"
                    name="currency-for-asset-fee"
                    value={AssetStore.selectedCurrencyForTransactionFee}
                    onChange={this.handleCurrencyForTransactionFee}
                    options={allCurrenciesCombined}
                    className={classes.select}
                    style={{
                      border: 'none',
                      borderRadius: 0,
                      borderBottom: '1px solid #757575',
                    }}
                    arrowRenderer={this.arrowRenderer}
                  />
                  <TextValidator
                    name="fee"
                    type="number"
                    label="Quantity"
                    className={classes.numberInputArrows}
                    value={AssetStore.assetAllocationFee}
                    onChange={this.handleRequests('assetAllocationFee')}
                    validators={['isPositive', 'maxNumber:100']}
                    errorMessages={['value must be a positive number', 'must be a number between 0 and 100']}
                    style={{ width: '100%', marginTop: '15px' }}
                  />
                </Grid>
              </Grid>

              <Grid container style={{ marginTop: '10px' }}>
                <Grid
                  item
                  xs={12}
                  className={classes.gridItemPadding}
                  style={{ textAlign: 'right' }}
                >
                  <RegularButton
                    type="submit"
                    color="primary"
                    // onClick={this.handleSave}
                    disabled={AssetStore.assetAllocationToAmount === ''
                      || AssetStore.selectedCurrencyToAssetAllocation === ''
                      || AssetStore.assetAllocationFromAmount === ''
                      || AssetStore.selectedCurrencyFromAssetAllocation === ''}
                  >RECORD
                  </RegularButton>
                </Grid>
              </Grid>
            </div>
          </ValidatorForm>
        </Paper>
      </Grid >
    );
  }
}

export default withStyles(styles)(AssetAllocation);
