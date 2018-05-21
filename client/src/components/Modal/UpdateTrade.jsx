// @flow
import React from 'react';
import { withStyles, Grid } from 'material-ui';
import Paper from 'material-ui/Paper';
import { inject, observer } from 'mobx-react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import { toJS } from 'mobx';
import Select from 'react-select';

import { Edit } from '@material-ui/icons';
import Modal from 'material-ui/Modal';
import IconButton from '../CustomButtons/IconButton';

import Button from '../CustomButtons/Button';
import SelectExchange from '../Selectors/Asset/SelectExchange';
import SelectPortfolioCurrency from '../Selectors/Asset/SelectPortfolioCurrency';
import '../Selectors/Asset/SelectAllCurrency';


function getModalStyle() {
  const top = 45;
  const left = 41;
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}

const styles = (theme: Object) => ({
  paper: {
    position: 'absolute',
    minWidth: '500px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '400',
    textAlign: 'center',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
});
type Props = {
  classes: Object,
  AssetStore: Object,
  MarketStore: Object,
  NotificationStore: Object,
};

type State = {
  open: boolean,
};

@inject('PortfolioStore', 'AssetStore', 'MarketStore')
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
    const { AssetStore } = this.props;
    // const hasErrors = AssetStore.handleAssetAllocationErrors();
    this.setState({ open: false });
    // if (hasErrors) {
    AssetStore.createAssetAllocation();
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
  };
  handleClose = () => {
    this.setState({ open: false });
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
const UpdateTradeModalWrapped = withStyles(styles)(UpdateTradeModal);

export default UpdateTradeModalWrapped;
