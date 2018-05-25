// @flow
import React from 'react';
import { withStyles, FormControl } from 'material-ui';
import { inject, observer } from 'mobx-react';
import Select from 'react-select';

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
  // state = {
  //   open: false,
  // };

  // handleOpen = () => {
  //   this.setState({ open: true });
  // };

  // handleClose = () => {
  //   this.setState({ open: false });
  // };

  handleChange = (event: SyntheticInputEvent) => {
    if (event) {
      this.props.AssetStore.selectCurrencyFromAssetAllocation(event.value);
      console.log(event)
    } else {
      this.props.AssetStore.resetCurrency();
    }
  };

  render() {
    const { classes, PortfolioStore, AssetStore } = this.props;
    const options = PortfolioStore.currentPortfolioAssets;
    const optionsToShow = options.map((el: Object) => ({ value: el.id, label: el.currency }));

    return (
      <div autoComplete="off">

        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          {/* <InputLabel htmlFor="controlled-open-select">
            Paid or sent
          </InputLabel> */}

          <Select
            placeholder="Paid or sent*"
            name="currency"
            // open={this.state.open}
            value={AssetStore.selectedCurrencyFromAssetAllocation.id || ''}
            // onClose={this.handleClose}
            options={optionsToShow}
            // onOpen={this.handleOpen}
            onChange={this.handleChange}
            // onClear={this.handleChange}
            inputProps={{
              name: 'portfolioCurrencyId',
              id: 'controlled-open-select',
            }}
            style={{
              border: 'none',
              borderRadius: 0,
              borderBottom: '1px solid #757575',
              marginTop: '12px',
              width: '95%',
            }}
          />
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(SelectPortfolioCurrency);
