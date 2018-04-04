import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, InputLabel, MenuItem, FormControl } from 'material-ui';
import Select from 'material-ui/Select';
import { inject, observer } from 'mobx-react';
import constants from '../../../variables/constants.json';

const styles = theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: '100%'
  }
});

@inject('MarketStore')
@observer
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
    this.props.MarketStore.selectExchange(value);
  };

  render() {
    const { classes, MarketStore } = this.props;

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

        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          <InputLabel htmlFor="controlled-open-select">
            Select Exchange
          </InputLabel>

          <Select
            open={this.state.open}
            value={MarketStore.selectedExchange}
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
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectExchange);
