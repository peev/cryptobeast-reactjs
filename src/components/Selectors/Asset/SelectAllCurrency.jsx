import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, InputLabel, MenuItem, FormControl } from 'material-ui';
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

@inject('MarketStore')
@observer
class SelectAllCurrency extends React.Component {
  state = {
    open: false,
    allCurrencyId: '',
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    const index = event.target.value;
    this.props.MarketStore.selectCurrencyFromAllCurrencies(index);

    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes, MarketStore } = this.props;

    const allCurrencies = MarketStore.allCurrencies.map((currency, i) => {
      return (
        <MenuItem
          key={i}
          value={i}
        >
          <em>{MarketStore.allCurrencies[i].currency}</em>
        </MenuItem>
      );
    });

    return (
      <div autoComplete="off">
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          <InputLabel htmlFor="controlled-open-select">
            Select Currency
          </InputLabel>

          <Select
            open={this.state.open}
            value={this.state.allCurrencyId}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            onChange={this.handleChange}
            inputProps={{
              name: 'allCurrencyId',
              id: 'controlled-open-select',
            }}
          >
            {allCurrencies}
          </Select>
        </FormControl>
      </div>
    );
  }
}

SelectAllCurrency.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectAllCurrency);
