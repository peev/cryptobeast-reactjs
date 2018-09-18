// @flow
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

const styles = () => ({
  formControl: {
    margin: '0',
    minWidth: '100%',
    minHeight: '70px'
  }
});

type Props = {
  classes: Object,
  Analytics: Object,
};

type State = {
  open: boolean,
  value: ?string,
};

@inject('Analytics')
@observer
class SelectPeriod extends React.Component<Props, State> {
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
    this.props.Analytics.selectTimeInPerformance(value);
  };

  render() {
    const { classes, Analytics } = this.props;
    const data = ['1d', '1m', '1y'];
    const display = data.map((el: Object, i: number) => {
      return (
        <MenuItem
          key={i}
          value={el}
          index={i}
        >
          <em>{el}</em>
        </MenuItem>
      );
    });

    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="period">
          Select Period
        </InputLabel>

        <Select
          value={Analytics.selectedTimeInPerformance}
          open={this.state.open}
          onOpen={this.handleOpen}
          onClose={this.handleClose}
          onChange={this.handleChange}
          inputProps={{ id: 'period' }}
        >
          {display}
        </Select>
      </FormControl>
    );
  }
}


export default withStyles(styles)(SelectPeriod);
