// @flow
import * as React from 'react';
import { withStyles, Grid } from 'material-ui';
import Paper from 'material-ui/Paper';
import Select from 'react-select';
import { inject, observer } from 'mobx-react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { toJS } from 'mobx';

import RegularButton from '../../CustomButtons/Button';
import SelectExchange from '../../Selectors/Asset/SelectExchange';
import NotificationSnackbar from '../../Modal/NotificationSnackbar';


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
    width: '95%',
    marginTop: '12px',
  },
});

type Props = {
  classes: Object,
  AssetStore: Object,
  MarketStore: Object,
  PortfolioStore: Object,
  NotificationStore: Object,
};

@inject('AssetStore', 'MarketStore', 'PortfolioStore', 'NotificationStore')
@observer
class AssetInput extends React.Component<Props> {
  handleRequest = (event: SyntheticInputEvent) => {
    event.preventDefault();
    const inputValue = event.target.value;

    this.props.AssetStore.setBasicAssetInputValue(inputValue);
  }

  handleSave = () => {
    const portfolioId = this.props.PortfolioStore.selectedPortfolioId;

    if (portfolioId !== null) {
      this.props.AssetStore.createBasicAsset(portfolioId);
      this.props.NotificationStore.addMessage('successMessages', 'Transaction recorded successfully');
      this.props.AssetStore.resetAsset();
    }
  }

  handleExchangeBasicInput = (value: *) => {
    this.props.AssetStore.selectExchangeBasicInput(value);
  }

  handleFromAllCurrenciesBasicAsset = (event: SyntheticInputEvent) => {
    if (event) {
      this.props.AssetStore.selectCurrencyBasicAsset(event.value);
    } else {
      this.props.AssetStore.selectCurrencyBasicAsset('');
    }
  }

  render() {
    const { classes, AssetStore, MarketStore } = this.props;
    const allCurrencies = toJS(MarketStore.allCurrencies);
    const baseCurrencies = toJS(MarketStore.baseCurrencies)
      .map((currency: object) => ({ value: currency.pair, label: currency.pair }))
      .filter((x: object) => x.value !== 'BTC' && x.value !== 'ETH');
    baseCurrencies.forEach((element: object) => allCurrencies.push(element));
    return (
      <Grid container >
        <Paper className={classes.container}>
          <h4 className={classes.containerTitle}>Basic asset input</h4>

          <ValidatorForm
            onSubmit={this.handleSave}
          >
            <Grid container className={classes.containerItems}>
              <Grid item xs={4} sm={3} md={3}>
                <Select
                  placeholder="Select currency*"
                  name="currency-to-asset-allocation"
                  value={AssetStore.selectedCurrencyBasicAsset || ''}
                  onChange={this.handleFromAllCurrenciesBasicAsset}
                  options={allCurrencies}
                  className={classes.input}
                  style={{
                  border: 'none',
                  borderRadius: 0,
                  borderBottom: '1px solid #757575',
                }}
                />
                <TextValidator
                  name="Quantity"
                  type="number"
                  label="Quantity*"
                  value={AssetStore.assetInputValue}
                  onChange={(e: SyntheticInputEvent) => this.handleRequest(e)}
                  // className={classes.input}
                  validators={['required', 'isPositive']}
                  errorMessages={['this field is required', 'value must be a positive number']}
                  style={{ width: '95%' }}
                />
              </Grid>

              <Grid item xs={4} sm={3} md={3}>
                <SelectExchange
                  label="Select Exchange (optional)"
                  value={AssetStore.selectedExchangeBasicInput}
                  handleChange={this.handleExchangeBasicInput}
                  style={{
                    marginTop: '12px',
                    width: '95%',
                    border: 'none',
                    borderRadius: 0,
                    borderBottom: '1px solid #757575',
                  }}
                />
              </Grid>
            </Grid>

            <Grid container className={classes.containerButton}>
              <RegularButton
                type="submit"
                color="primary"
                className="btnAdd"
              // onClick={this.handleSave}
                disabled={AssetStore.assetInputValue === '' || AssetStore.selectedCurrencyBasicAsset === ''}
              >ADD
              </RegularButton>
            </Grid>
          </ValidatorForm>
        </Paper>
        <NotificationSnackbar />
      </Grid>
    );
  }
}


export default withStyles(styles)(AssetInput);
