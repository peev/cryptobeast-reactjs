import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, InputLabel, MenuItem, FormControl } from 'material-ui';
import Select from 'material-ui/Select';
import { SelectValidator } from 'react-material-ui-form-validator';
import constants from '../../../variables/constants.json';

const styles = theme => ({
  formControl: {
    minWidth: '100%',
  },
});

class SelectExchange extends React.Component {
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
    this.props.handleChange(value);
  };
  
  render() {
    const { classes, value, label, validators, errorMessages } = this.props;
    const allExchanges = constants.services.map((name, i) => (
      <MenuItem
        key={i}
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
          >
            {allExchanges}
          </SelectValidator>
        </FormControl>
      </div>
    );
  }
}

SelectExchange.propTypes = {
  classes: PropTypes.object,
  handleChange: PropTypes.func,
  value: PropTypes.string,
  label: PropTypes.string,
  validators: PropTypes.array,
  errorMessages: PropTypes.array,
};

export default withStyles(styles)(SelectExchange);
