// @flow
import React, { SyntheticEvent } from 'react';

import Select from 'react-select';

import { withStyles } from 'material-ui/styles';
// import { InputLabel } from 'material-ui/Input';

import { FormControl } from 'material-ui/Form';

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
  InvestorStore: Object,
  MarketStore: Object,
};

type State = {
  open: boolean,
  baseCurrency: ?string,
};

@inject('MarketStore', 'InvestorStore')
@observer
class SelectBaseCurrency extends React.Component<Props, State> {
  state = {
    open: false,
    baseCurrency: '',
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event: SyntheticEvent) => {
    if (event) {
      this.props.MarketStore.selectBaseCurrency(event.value);
      // What Does This Do?
    this.props.InvestorStore.convertedUsdEquiv; // eslint-disable-line

      this.setState({ baseCurrency: event.value });
    } else {
      this.props.MarketStore.selectBaseCurrency('');
      this.setState({ baseCurrency: '' });
    }
  };

  render() {
    const { classes, label, MarketStore } = this.props;
    console.log(MarketStore.baseCurrencies);
    const currenciesToShow = [];
    const baseCurrencies = MarketStore.baseCurrencies.map((currency: object) => ({ value: currency.pair, label: currency.pair }));
    baseCurrencies.forEach((currency: object) => {
      currenciesToShow.push(currency);
    });

    // const baseCurrencies = MarketStore.baseCurrencies.map((el: Object, i: number) =>
    //   ((currencies.length === 0 || currencies.includes(MarketStore.baseCurrencies[i].pair)) ?
    //     (
    //       <MenuItem
    //         key={uuid()}
    //         value={i}
    //       >
    //         <em>{MarketStore.baseCurrencies[i].pair}</em>
    //       </MenuItem>
    //     ) : ''
    //   ));

    return (
      <div autoComplete="off">
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          {/* <InputLabel htmlFor="controlled-open-select">
            Select Currency
          </InputLabel> */}

          <Select
            name="currency"
            placeholder={label || 'Select Base Currency*'}
            open={this.state.open}
            value={this.state.baseCurrency}
            // onOpen={this.handleOpen}
            options={currenciesToShow}
            onClose={this.handleClose}
            onChange={this.handleChange}
            style={{
              marginTop: '12px',
              width: '95%',
              border: 'none',
              borderRadius: 0,
              borderBottom: '1px solid #757575',
            }}
            inputProps={{
              name: 'baseCurrencyId',
              id: 'controlled-open-select',
            }}
          />
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(SelectBaseCurrency);
