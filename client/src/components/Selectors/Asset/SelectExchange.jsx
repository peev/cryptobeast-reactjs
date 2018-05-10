// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, MenuItem, FormControl } from 'material-ui';
import uuid from 'uuid/v4';
import { SelectValidator } from 'react-material-ui-form-validator';
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
  validators: Array<any>,
  errorMessages: Array<any>,
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
    const { value } = event.target;
    this.props.handleChange(value);
  };

  render() {
    const { classes, value, label, validators, errorMessages } = this.props;
    const allExchanges = constants.services.map((name: string) => (
      <MenuItem
        key={uuid()}
        value={name}
      >
        <em>{name}</em>
      </MenuItem>
    ));

    return (
      <div autoComplete="off">

        <FormControl className={classes.formControl}>
          {/* <InputLabel htmlFor="controlled-open-select">
          Select Exchange
          </InputLabel> */}

          <SelectValidator
            name="select exchange"
            label={label}
            open={this.state.open}
            value={value}
            onClose={this.handleClose}
            onChange={this.handleChange}
            inputProps={{
              name: 'exchangeId',
              id: 'controlled-open-select',
            }}
            validators={validators}
            errorMessages={errorMessages}
            style={{ width: '95%' }}
          >
            {allExchanges}
          </SelectValidator>
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(SelectExchange);
