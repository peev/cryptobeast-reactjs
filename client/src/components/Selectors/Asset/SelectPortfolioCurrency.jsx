// @flow
import React from 'react';
import { withStyles, FormControl } from 'material-ui';
import { inject, observer } from 'mobx-react';
import Select from 'react-select';

const styles = () => ({
  container: {
    width: '100%',
  },
  formControl: {
    margin: 0,
    minWidth: '100%',
  },
});

type Props = {
  AssetStore: Object,
  classes: Object,
};

@inject('AssetStore')
@observer
class SelectPortfolioCurrency extends React.Component<Props> {
  handleChange = (event: SyntheticInputEvent) => {
    if (event) {
      this.props.AssetStore.selectCurrencyFromAssetAllocation(event.value);
    } else {
      this.props.AssetStore.resetCurrency();
    }
  };

  render() {
    const { classes, AssetStore } = this.props;
    const { currentPortfolioAssetsToShow } = AssetStore;

    return (
      <div autoComplete="off" className={classes.container}>
        <FormControl className={classes.formControl}>
          <Select
            placeholder="Paid or sent*"
            name="currency"
            value={AssetStore.selectedCurrencyFromAssetAllocation.id || ''}
            options={currentPortfolioAssetsToShow}
            onChange={this.handleChange}
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
