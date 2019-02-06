// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { inject, observer } from 'mobx-react';

const styles = () => ({
  button: {
    display: 'block',
  },
  formControl: {
    margin: '0',
    minWidth: '100%',
  },
  formGroup: {
    minHeight: '70px',
  },
});

type Props = {
  classes: Object,
  muiname: 'SelectBenchmark'
};

type State = {
  open: boolean,
  value: ?string,
};

// Does not appear to use anything in the store?
@inject('InvestorStore')
@observer
class SelectBenchmark extends React.Component<Props, State> {
  state = {
    open: false,
    value: '',
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="benchMark">
            Select Benchmark
          </InputLabel>
          <Select
            value={this.state.value}
            open={this.state.open}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            inputProps={{ id: 'benchMark' }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }
}


export default withStyles(styles)(SelectBenchmark);
