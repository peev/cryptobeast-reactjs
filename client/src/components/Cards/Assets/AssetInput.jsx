// @flow
import * as React from 'react';
import { withStyles, Grid } from 'material-ui';
import Paper from 'material-ui/Paper';
import Select from 'react-select';
import { inject, observer } from 'mobx-react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import RegularButton from '../../CustomButtons/Button';
import SelectExchange from '../../Selectors/Asset/SelectExchange';
import NotificationSnackbar from '../../Modal/NotificationSnackbar';


const styles = () => ({
  container: {
    width: '100%',
    padding: '20px 25px',
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  containerTitle: {
    margin: '0',
    fontSize: '16px',
    textTransform: 'uppercase',
  },
  containerItems: {
    display: 'flex',
    margin: '20px -20px',
    width: 'auto',
  },
  containerButton: {
    justifyContent: 'flex-end',
  },
  btnAdd: {
    float: 'right',
    margin: '0',
  },
  font: {
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif, !important',
    width: '100%',
    '& input': {
      margin: 0,
      paddingLeft: '10px',
      paddingRight: '10px',
    },
    '& label': {
      position: 'absolute',
      left: '10px',
      top: '-15px',
    },
    '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: '0',
    },
  },
  removeMargin: {
    '&>div>div': {
      margin: '4px 0 0 0',
    },
  },
  gridPadding: {
    padding: '0 20px',
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
    const { allCurrenciesCombined } = MarketStore;

    return (
      <Grid container >
        <Paper className={classes.container}>
          <h4 className={classes.containerTitle}>Basic asset input</h4>

          <ValidatorForm
            onSubmit={this.handleSave}
            className={classes.inputsContainer}
          >
            <Grid container className={classes.containerItems}>
              <Grid item xs={12} sm={6} md={4} className={classes.gridPadding}>
                <Select
                  placeholder="Select currency*"
                  name="currency-to-asset-allocation"
                  value={AssetStore.selectedCurrencyBasicAsset || ''}
                  onChange={this.handleFromAllCurrenciesBasicAsset}
                  options={allCurrenciesCombined}
                  style={{
                    border: 'none',
                    borderRadius: 0,
                    borderBottom: '1px solid #757575',
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} className={`${classes.removeMargin} ${classes.gridPadding}`}>
                <TextValidator
                  name="Quantity"
                  type="number"
                  label="Quantity*"
                  value={AssetStore.assetInputValue}
                  onChange={(e: SyntheticInputEvent) => this.handleRequest(e)}
                  validators={['required', 'isPositive']}
                  errorMessages={['this field is required', 'value must be a positive number']}
                  className={classes.font}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} className={classes.gridPadding}>
                <SelectExchange
                  label="Select Exchange (optional)"
                  value={AssetStore.selectedExchangeBasicInput}
                  handleChange={this.handleExchangeBasicInput}
                  style={{
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
                style={{
                  margin: '0 25px 0 0',
                }}
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
