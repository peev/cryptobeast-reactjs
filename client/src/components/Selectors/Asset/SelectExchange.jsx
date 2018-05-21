// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, FormControl } from 'material-ui';
import Select from 'react-select';
import constants from '../../../variables/constants.json';

const styles = () => ({
  formControl: {
    minWidth: '100%',
  },
});

type Props = {
  classes: Object,
  handleChange: PropTypes.func,
  value: string,
  label: string,
  style: Object,
};

type State = {
  open: boolean,
};

class SelectExchange extends React.Component<Props, State> {
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
    if (event) {
      this.props.handleChange(event.value);
    } else {
      this.props.handleChange('');
    }
  };

  render() {
    const { classes, value, label, style } = this.props;
    const allExchanges = constants.services.map((name: string) => ({ value: name, label: name }));

    return (
      <div autoComplete="off">

        <FormControl className={classes.formControl}>
          {/* <InputLabel htmlFor="controlled-open-select">
          Select Exchange
          </InputLabel> */}

          <Select
            name="select exchange"
            placeholder={label}
            open={this.state.open}
            value={value}
            onClose={this.handleClose}
            onChange={this.handleChange}
            inputProps={{
              name: 'exchangeId',
              id: 'controlled-open-select',
            }}
            options={allExchanges}
            style={style}
          />
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(SelectExchange);
