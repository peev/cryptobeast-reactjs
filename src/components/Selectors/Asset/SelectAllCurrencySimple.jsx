import React from 'react';
import Select from 'react-select';
import { inject, observer } from 'mobx-react';

@inject('MarketStore')
@observer
class SelectAllCurrencySimple extends React.Component {
  state = {
    selectedOption: '',
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.MarketStore.selectCurrencyFromAllCurrencies(selectedOption);

    console.log(selectedOption.label);
  }

  render() {
    const { MarketStore } = this.props;
    // console.log(value);

    return (
      <Select
        name="form-field-name"
        value={MarketStore.selectedCurrency}
        onChange={this.handleChange}
        options={MarketStore.allCurrencies}
      />
    );
  }
}

export default SelectAllCurrencySimple;
