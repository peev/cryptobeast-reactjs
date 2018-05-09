// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, MenuItem, FormControl, FormHelperText } from 'material-ui';
import { inject, observer } from 'mobx-react';
import uuid from 'uuid/v4';
import { SelectValidator } from 'react-material-ui-form-validator';
import { InputLabel } from 'material-ui/Input';

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
  AssetStore: Object,
  PortfolioStore: Object,
  classes: Object,
};

type State = {
  open: boolean,
};

@inject('PortfolioStore', 'AssetStore')
@observer
class SelectPortfolioCurrency extends React.Component<Props, State> {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event: SyntheticEvent) => {
    const { value } = event.target;

    this.props.AssetStore.selectCurrencyFromAssetAllocation(value);
  };

  render() {
    const { classes, PortfolioStore, AssetStore } = this.props;

    const allExchanges = PortfolioStore
      .currentPortfolioAssets.map((el: Object) => (
        <MenuItem
          key={uuid()}
          value={el.id}
        >
          <em>{el.currency}</em>
        </MenuItem>
      ));

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
          <FormHelperText>Some important helper text</FormHelperText>
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(SelectPortfolioCurrency);
