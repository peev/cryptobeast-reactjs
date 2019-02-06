// @flow
import React from 'react';
import uuid from 'uuid/v4';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
  // muiname: 'SelectPeriod',
  defaultValueIndex: number,
  selectedValue: string,
};

type State = {
  // open: boolean,
  value: ?string,
};

class MotionSelect extends React.Component<Props, State> {
  state = {
    // open: false,
    init: true,
    value: '1d',
  };

  // handleOpen = () => {
  //   this.setState({ open: true });
  // };

  handleChange = (event: SyntheticEvent) => {
    if (!event.target.value) {
      return;
    }
    this.props.selectedValue(event.target.value);
    this.setState({
      init: false,
      // open: false,
      value: event.target.value,
    });
  }

  // handleClose = (event) => {
  //    this.setState({ open: false });
  // };

  render() {
    // eslint-disable-next-line react/prop-types
    const { classes, values, title, defaultValueIndex } = this.props;
    const { value, init } = this.state;

    let data = ['1d', '1m', '1y'];
    let selectTitle = 'Select Period';
    let defaultVal = value;

    if (values && values.length) {
      data = values;
    }

    if (title && values.length) {
      selectTitle = title;
    }

    if ((defaultValueIndex !== undefined) && init) {
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
            // open={open}
            onChange={this.handleChange}
            // onOpen={this.handleOpen}
            // onClose={this.handleClose}
            inputProps={{ name: 'SelectPeriod', id: 'SelectPeriod' }}
          >
          {data.map((val: string) => (
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
