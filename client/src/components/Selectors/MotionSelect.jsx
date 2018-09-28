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
  muiname: 'SelectPeriod',
  defaultValueIndex: Number
};

type State = {
  open: boolean,
  value: ?string,
};

class MotionSelect extends React.Component<Props, State> {
  state = {
    open: false,
    init: true,
    value: '1d',
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
      init: false,
      open: false, 
      value: event.target.dataset.value 
    });
  };

  render() {
    const { classes, values, title, defaultValueIndex } = this.props
    const { value, open, init } = this.state

    let data = ['1d', '1m', '1y'];
    let selectTitle = 'Select Period';
    
    if(values && values.length) {
      data = values;
    }
    if(title && values.length) {
      selectTitle = title;
    }
    let defaultVal = value;
    if((defaultValueIndex !== undefined) && init) {
      defaultVal = data[defaultValueIndex];
    }
    return (
      <div autoComplete="off">
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          <InputLabel htmlFor="SelectPeriod">
            {selectTitle}
          </InputLabel>

          <Select
            value={defaultVal}
            open={open}
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

export default withStyles(styles)(MotionSelect);
