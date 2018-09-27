// @flow
import React from 'react';
import uuid from 'uuid/v4';
import { FormControl, InputLabel, Select, MenuItem, withStyles } from '@material-ui/core';

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
  classes: Object,
  muiname: 'SelectPeriod'
};

type State = {
  open: boolean,
  value: ?string,
};

class SelectPeriod extends React.Component<Props, State> {
  state = {
    open: false,
    value: '1m',
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = (event) => {
    if(!event.target.dataset.value) {
      return;
    }
    this.props.selectedValue(event.target.dataset.value);
    this.setState({ 
      open: false, 
      value: event.target.dataset.value 
    });
  };

  render() {
    const { classes, values } = this.props
    let data = ['1d', '1m', '1y'];
    if(values) {
      data = values;
    }

    return (
      <div autoComplete="off">
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          <InputLabel htmlFor="SelectPeriod">
            Select Period
          </InputLabel>

          <Select
            value={this.state.value}
            open={this.state.open}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            inputProps={{ name: 'SelectPeriod', id: 'SelectPeriod' }}
          >
          {data.map((val) => (
            <MenuItem key={uuid()} value={val}>
              <em>{val}</em>
            </MenuItem>
          ))}
          </Select>
        </FormControl>
      </div >
    );
  }
}

export default withStyles(styles)(SelectPeriod);
