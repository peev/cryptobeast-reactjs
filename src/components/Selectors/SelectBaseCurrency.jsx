import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
// import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import { SelectValidator } from 'react-material-ui-form-validator';
import { inject, observer } from 'mobx-react';

const styles = theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: '100%',
  },
});

@inject('MarketStore')
@observer
class SelectBaseCurrency extends React.Component {
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

  handleChange = (event) => {
    const index = event.target.value;
    this.props.MarketStore.selectBaseCurrency(index);

    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes, MarketStore } = this.props;
    const baseCurrencies = MarketStore.baseCurrencies.map((currency, i) => (
      <MenuItem
        key={i}
        value={i}
      >
        <em>{MarketStore.baseCurrencies[i].pair}</em>
      </MenuItem>
    ));

    return (
      <div autoComplete="off">
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          {/* <InputLabel htmlFor="controlled-open-select">
            Select Currency
          </InputLabel> */}

          <SelectValidator
            name="currency"
            label="Select Base Currency"
            open={this.state.open}
            value={this.state.baseCurrencyId}
            // onOpen={this.handleOpen}
            onClose={this.handleClose}
            onChange={this.handleChange}
            validators={['required']}
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

SelectBaseCurrency.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectBaseCurrency);
