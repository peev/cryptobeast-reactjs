// @flow
import React from 'react';
import { withStyles, FormControl } from 'material-ui';
import { inject, observer } from 'mobx-react';
import Select from 'react-select';
import DropDownArrow from '../../CustomIcons/DropDown/DropDownArrow';


const styles = () => ({
  container: {
    width: '100%',
  },
  formControl: {
    margin: 0,
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
    '& .Select-placeholder:hover': {
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

  arrowRenderer = () => (
    <DropDownArrow />
  );

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
            }}
            arrowRenderer={this.arrowRenderer}
            className={classes.select}
          />
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(SelectPortfolioCurrency);
