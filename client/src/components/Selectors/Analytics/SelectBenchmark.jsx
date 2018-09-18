// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { InputLabel } from '@material-ui/core/Input';
import { MenuItem } from '@material-ui/core/Menu';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
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
    minHeight: '70px'
  }
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
    const options = [
      { value: 'None', label: 'None' }
    ];

    return (
      <div autoComplete="off" className={classes.formGroup}>
        <FormControl className={classes.formControl}>
          <label htmlFor="benchMark">
            Select Benchmark
          </label>
          <Select
            value={this.state.value}
            open={this.state.open}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            options={options}
            inputProps={{ id: 'benchMark' }}
          />
        </FormControl>
      </div>
    );
  }
}


export default withStyles(styles)(SelectBenchmark);
