// @flow
import * as React from 'react';
import { withStyles, Grid } from 'material-ui';
import Paper from 'material-ui/Paper';
import { inject, observer } from 'mobx-react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { MenuItem } from 'material-ui/Menu';
import SelectValidator from 'react-material-ui-form-validator/lib/SelectValidator';

import RegularButton from '../../CustomButtons/Button';
import SelectExchange from '../../Selectors/Asset/SelectExchange';
import NotificationSnackbar from '../../Modal/NotificationSnackbar';
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
  containerButton: {
    paddingLeft: '8px',
  },
  btnAdd: {
    float: 'right',
    margin: '0',
  },
  input: {
    width: '100%',
    // marginTop: '12px',
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
      this.props.AssetStore.selectCurrencyBasicAsset(event.target.value);
    } else {
      this.props.AssetStore.selectCurrencyBasicAsset('');
    }
  }

  render() {
    const { classes, AssetStore, MarketStore } = this.props;
    const options = MarketStore.allCurrencies;
    const optionsToShow = [];

    options.forEach((element: Object, i: number) => {
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
      <Grid container >
        <Paper className={classes.container}>
          <h4 className={classes.containerTitle}>Basic asset input</h4>

          <ValidatorForm
            onSubmit={this.handleSave}
          >
            <Grid container className={classes.containerItems}>
              <Grid item xs={4} sm={3} md={3}>
                <SelectValidator
                  label="Select Currency"
                  name="currency-to-asset-allocation"
                  value={AssetStore.selectedCurrencyBasicAsset}
                  onChange={this.handleFromAllCurrenciesBasicAsset}
                  className={classes.input}
                  validators={['required']}
                  errorMessages={['this field is required']}
                >
                  {optionsToShow}
                </SelectValidator>
                <TextValidator
                  name="Quantity"
                  type="number"
                  label="Quantity..."
                  value={AssetStore.assetInputValue}
                  onChange={(e: SyntheticInputEvent) => this.handleRequest(e)}
                  // className={classes.input}
                  validators={['required', 'isPositive']}
                  errorMessages={['this field is required', 'value must be a positive number']}
                />
              </Grid>

              <Grid item xs={4} sm={3} md={3}>
                <SelectExchange
                  label="Select Exchange (optional)"
                  value={AssetStore.selectedExchangeBasicInput}
                  handleChange={this.handleExchangeBasicInput}
                />
              </Grid>
            </Grid>

            <Grid container className={classes.containerButton}>
              <RegularButton
                type="submit"
                color="primary"
                className="btnAdd"
                // onClick={this.handleSave}
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