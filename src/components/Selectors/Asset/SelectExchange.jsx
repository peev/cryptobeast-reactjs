import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, InputLabel, MenuItem, FormControl } from 'material-ui';
import Select from 'material-ui/Select';
import constants from '../../../variables/constants.json';

const styles = theme => ({
  formControl: {
    minWidth: '100%',
  }
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
    const { classes, value } = this.props;

    const allExchanges = constants.services.map((name, i) => {
      return (
        <MenuItem
          key={i}
          value={name}
        >
          <em>{name}</em>
        </MenuItem>
      );
    });

    return (
      <form autoComplete="off">

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="controlled-open-select">
            Select Exchange
          </InputLabel>

          <Select
            open={this.state.open}
            value={value}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
            onChange={this.handleChange}
            inputProps={{
              name: 'exchangeId',
              id: 'controlled-open-select',
            }}
          >
            {allExchanges}
          </Select>
        </FormControl>
      </form>
    );
  }
}

SelectExchange.propTypes = {
  classes: PropTypes.object,
  handleChange: PropTypes.func,
  value: PropTypes.string,
};

export default withStyles(styles)(SelectExchange);
