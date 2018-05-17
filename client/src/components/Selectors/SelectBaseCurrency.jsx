// @flow
import React, { SyntheticEvent } from 'react';
import uuid from 'uuid/v4';
import { withStyles } from 'material-ui/styles';
// import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import { SelectValidator } from 'react-material-ui-form-validator';
import { inject, observer } from 'mobx-react';

const styles = (theme: Object) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: '100%',
  },
});

type Props = {
  classes: Object,
  currencies: Array<string>,
  label: string,
  validators: Array<any>,
  InvestorStore: Object,
  MarketStore: Object,
};

type State = {
  open: boolean,
  baseCurrencyId: ?string,
};

@inject('MarketStore', 'InvestorStore')
@observer
class SelectBaseCurrency extends React.Component<Props, State> {
  state = {
    open: false,
    baseCurrencyId: '',
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event: SyntheticEvent) => {
    const index = event.target.value;
    this.props.MarketStore.selectBaseCurrency(index);
    // What Does This Do?
    this.props.InvestorStore.convertedUsdEquiv; // eslint-disable-line

    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes, label, validators, MarketStore, currencies = [] } = this.props;
    const baseCurrencies = MarketStore.baseCurrencies.map((el: Object, i: number) =>
      ((currencies.length === 0 || currencies.includes(MarketStore.baseCurrencies[i].pair)) ?
        (
          <MenuItem
            key={uuid()}
            value={i}
          >
            <em>{MarketStore.baseCurrencies[i].pair}</em>
          </MenuItem>
        ) : ''
      ));

    return (
      <div autoComplete="off">
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          {/* <InputLabel htmlFor="controlled-open-select">
            Select Currency
          </InputLabel> */}

          <SelectValidator
            name="currency"
            label={label || 'Select Base Currency*'}
            open={this.state.open}
            value={this.state.baseCurrencyId}
            // onOpen={this.handleOpen}
            onClose={this.handleClose}
            onChange={this.handleChange}
            validators={validators || ['required']}
            style={{ width: '95%' }}
            errorMessages={['this field is required']}
            inputProps={{
              name: 'baseCurrencyId',
              id: 'controlled-open-select',
            }}
          >
            {baseCurrencies}
          </SelectValidator>
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(SelectBaseCurrency);
