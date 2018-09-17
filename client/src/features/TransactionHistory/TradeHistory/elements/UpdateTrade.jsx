// @flow
import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { inject, observer } from 'mobx-react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import { toJS } from 'mobx';
import Select from 'react-select';

import { Edit } from '@material-ui/icons';
import Modal from '@material-ui/core/Modal';
import IconButton from '../../../../components/CustomButtons/IconButton';

import Button from '../../../../components/CustomButtons/Button';
import SelectExchange from '../../../../components/Selectors/Asset/SelectExchange';
import SelectPortfolioCurrency from '../../../../components/Selectors/Asset/SelectPortfolioCurrency';
import '../../../../components/Selectors/Asset/SelectAllCurrency';
import updateTradeStyles from './UpdateTradeStyles';

function getModalStyle() {
  const top = 45;
  const left = 41;
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}

type Props = {
  classes: Object,
  AssetStore: Object,
  MarketStore: Object,
  NotificationStore: Object,
  trade: Object,
};

type State = {
  open: boolean,
};

@inject('AssetStore', 'MarketStore', 'NotificationStore')
@observer
class UpdateTradeModal extends React.Component<Props, State> {
  name: ?React.Ref<any> = null;
  state = {
    open: false,
  };

  componentWillUnmount() {
    this.props.AssetStore.resetAsset();
  }

  handleSave = () => {
    const { AssetStore, trade } = this.props;
    // const hasErrors = AssetStore.handleAssetAllocationErrors();
    this.setState({ open: false });
    // if (hasErrors) {
    AssetStore.updateTradeAssetAllocation(trade);
    this.props.NotificationStore.addMessage('successMessages', 'Successful asset allocation');
    AssetStore.resetAssetAllocation();
    // }
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

  handleOpen = () => {
    this.setState({ open: true });
    const { trade } = this.props;
    if (trade.source !== 'Manually added') {
      this.props.AssetStore.selectExchangeAssetAllocation(trade.source);
    }
    this.props.AssetStore.setAssetAllocationValue('assetAllocationSelectedDate', trade.transactionDate);
    this.props.AssetStore.selectCurrencyFromAssetAllocation(trade.fromAssetId);
    this.props.AssetStore.setAssetAllocationValue('assetAllocationFromAmount', trade.fromAmount);
    this.props.AssetStore.selectCurrencyToAssetAllocation(trade.toCurrency);
    this.props.AssetStore.setAssetAllocationValue('assetAllocationToAmount', trade.toAmount);
    this.props.AssetStore.selectCurrencyForTransactionFee(trade.feeCurrency);
    this.props.AssetStore.setAssetAllocationValue('assetAllocationFee', trade.fee);
  };
  handleClose = () => {
    this.setState({ open: false });
    this.props.AssetStore.resetAssetAllocation();
  };

  render() {
    const {
      classes,
      AssetStore,
      MarketStore,
    } = this.props;

    const allCurrencies = toJS(MarketStore.allCurrencies);
    const baseCurrencies = toJS(MarketStore.baseCurrencies)
      .map((currency: object) => ({ value: currency.pair, label: currency.pair }))
      .filter((x: object) => x.value !== 'BTC' && x.value !== 'ETH');
    baseCurrencies.forEach((element: object) => allCurrencies.push(element));

    return (
      <div style={{ display: 'inline-block' }}>
        <IconButton
          customClass="edit"
          onClick={this.handleOpen}
          color="primary"
        >
          <Edit style={{ width: '.8em', height: '.8em' }} />
        </IconButton>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <Grid container>
            <Paper className={classes.container}>
              <h4 className={classes.containerTitle}>Asset Allocation</h4>
              <ValidatorForm
                onSubmit={this.handleSave}
                // onError={errors => console.log(errors)}
                style={getModalStyle()}
                className={classes.paper}
              >
                <Grid container className={classes.containerItems}>
                  <Grid item xs={3}>
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
                      label="Quantity*"
                      value={AssetStore.assetAllocationFromAmount}
                      className={classes.alignInputAfter}
                      onChange={this.handleRequests('assetAllocationFromAmount')}
                      validators={['required']}
                      errorMessages={['this field is required']}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <Select
                      placeholder="Bought or received*"
                      name="currency-to-asset-allocation"
                      value={AssetStore.selectedCurrencyToAssetAllocation}
                      onChange={this.handleCurrencyToAssetAllocation}
                      options={allCurrencies}
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
                      className={classes.alignInputAfter}
                      value={AssetStore.assetAllocationToAmount}
                      onChange={this.handleRequests('assetAllocationToAmount')}
                      validators={['required']}
                      errorMessages={['this field is required']}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <Select
                      placeholder="Transaction Fee (optional)"
                      name="currency-for-asset-fee"
                      value={AssetStore.selectedCurrencyForTransactionFee}
                      onChange={this.handleCurrencyForTransactionFee}
                      options={allCurrencies}
                      className={classes.alignInputAfter2}
                      style={{
                        border: 'none',
                        borderRadius: 0,
                        borderBottom: '1px solid #757575',
                      }}
                    />
                    <TextValidator
                      name="fee"
                      label="Quantity"
                      type="number"
                      placeholder="Quantity..."
                      className={classes.alignInputAfter}
                      value={AssetStore.assetAllocationFee}
                      onChange={this.handleRequests('assetAllocationFee')}
                      validators={['required', 'maxNumber:100']}
                      errorMessages={['this field is required', 'must be a number between 0 and 100']}
                    />
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12}>
                    <div className={classes.buttonsContainer}>
                      {/* Cancel BUTTON */}
                      <Button
                        style={{ display: 'inline-flex', marginRight: '50px', float: 'left' }}
                        onClick={this.handleClose}
                        color="primary"
                      >
                        {' '}
                        Cancel
                      </Button>

                      {/* SAVE BUTTON */}
                      <Button
                        style={{ display: 'inline-flex', float: 'right' }}
                        // onClick={this.handleSave}
                        color="primary"
                        type="submit"
                        disabled
                      // disabled={AssetStore.assetAllocationToAmount === '' || AssetStore.selectedCurrencyToAssetAllocation === '' ||
                      //   AssetStore.assetAllocationFromAmount === '' || AssetStore.assetAllocationSelectedDate === '' ||
                      //   AssetStore.selectedCurrencyFromAssetAllocation === ''}
                      >
                        {' '}
                        Save
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </ValidatorForm>
            </Paper>
          </Grid>
        </Modal>
      </div>
    );
  }
}


// We need an intermediary variable for handling the recursive nesting.
const UpdateTradeModalWrapped = withStyles(updateTradeStyles)(UpdateTradeModal);

export default UpdateTradeModalWrapped;
