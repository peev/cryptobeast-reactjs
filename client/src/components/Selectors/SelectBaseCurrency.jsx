// @flow
import React, { SyntheticEvent } from 'react';
import Select from 'react-select';
import { withStyles } from 'material-ui/styles';
import { FormControl } from 'material-ui/Form';
import { inject, observer } from 'mobx-react';
import DropDownArrow from '../CustomIcons/DropDown/DropDownArrow';

const styles = (theme: Object) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: '100%',
    '& .is-open > .Select-control .Select-arrow-zone svg': {
      position: 'relative',
      left: '-8px',
      transform: 'rotate(180deg)',
    },
  },
  select: {
    '& .Select-placeholder': {
      top: '2px',
    },
    '& .Select-placeholder:hover, &.is-focused': {
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
});

type Props = {
  classes: Object,
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

  arrowRenderer = () => (
    <DropDownArrow />
  );

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
    const currenciesToShow = [];
    const baseCurrencies = MarketStore.baseCurrencies.map((currency: object) => ({ value: currency.pair, label: currency.pair }));
    baseCurrencies.forEach((currency: object) => {
      currenciesToShow.push(currency);
    });

    return (
      <div autoComplete="off">
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          <Select
            name="currency"
            placeholder={label || 'Select Base Currency*'}
            open={this.state.open}
            value={this.state.baseCurrency}
            options={currenciesToShow}
            onClose={this.handleClose}
            onChange={this.handleChange}
            style={{
              marginTop: '12px',
              border: 'none',
              borderRadius: 0,
              borderBottom: '1px solid #757575',
            }}
            inputProps={{
              name: 'baseCurrencyId',
              id: 'controlled-open-select',
            }}
            arrowRenderer={this.arrowRenderer}
            className={classes.select}
          />
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(SelectBaseCurrency);
