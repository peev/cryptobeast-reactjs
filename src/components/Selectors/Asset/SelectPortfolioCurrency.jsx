import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, InputLabel, MenuItem, FormControl } from 'material-ui';
import Select from 'material-ui/Select';
import { inject, observer } from 'mobx-react';
import { SelectValidator, ValidatorForm } from 'react-material-ui-form-validator';

const styles = theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: '100%',
  }
});

@inject('PortfolioStore', 'AssetStore')
@observer
class SelectPortfolioCurrency extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    const { value } = event.target;

    this.props.AssetStore.selectCurrencyFromAssetAllocation(value);
  };

  render() {
    const { classes, PortfolioStore, AssetStore } = this.props;

    const allExchanges = PortfolioStore.currentPortfolioAssets.map((el, i) => {
      return (
        <MenuItem
          key={i}
          value={el.id}
        >
          <em>{el.currency}</em>
        </MenuItem>
      );
    });

    return (
      <div autoComplete="off">

        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          {/* <InputLabel htmlFor="controlled-open-select">
            Paid or sent
          </InputLabel> */}

          <SelectValidator
            label="Paid or sent"
            name="currency"
            open={this.state.open}
            value={AssetStore.selectedCurrencyFromAssetAllocation.id || ''}
            onClose={this.handleClose}
            // onOpen={this.handleOpen}
            onChange={this.handleChange}
            inputProps={{
              name: 'portfolioCurrencyId',
              id: 'controlled-open-select',
            }}
            validators={['required']}
            errorMessages={['this field is required']}
          >
            {allExchanges.length > 0 ? allExchanges : ''}
          </SelectValidator>
        </FormControl>
      </div>
    );
  }
}

SelectPortfolioCurrency.propTypes = {
  classes: PropTypes.object,
  // handleChange: PropTypes.func,
  // value: PropTypes.string,
};

export default withStyles(styles)(SelectPortfolioCurrency);
