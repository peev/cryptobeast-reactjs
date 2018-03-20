import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
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

@inject('InvestorStore')
@observer
class SelectCurrency extends React.Component {
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
    this.props.InvestorStore.selectBaseCurrency(index);

    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes, InvestorStore } = this.props;
    const baseCurrencies = InvestorStore.baseCurrencies.map((currency, i) => {
      return (
        <MenuItem
          key={i}
          value={i}
        >
          <em>{InvestorStore.baseCurrencies[i].MarketName}</em>
        </MenuItem>
      );
    });

    return (
      <form autoComplete="off">
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          <InputLabel htmlFor="controlled-open-select">
            Select Currency
          </InputLabel>

          <Select
            open={this.state.open}
            value={this.state.baseCurrencyId}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            onChange={this.handleChange}
            inputProps={{
              name: 'baseCurrencyId',
              id: 'controlled-open-select',
            }}
          >
            {baseCurrencies}
          </Select>
        </FormControl>
      </form>
    );
  }
}

SelectCurrency.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectCurrency);
