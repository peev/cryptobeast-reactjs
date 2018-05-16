// @flow
import React from 'react';
import { withStyles } from 'material-ui/styles';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { inject, observer } from 'mobx-react';

const styles = () => ({
  button: {
    display: 'block',
  },
  formControl: {
    margin: '0',
    minWidth: '100%',
  },
});

type Props = {
  classes: Object,
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
          <InputLabel htmlFor="controlled-open-select">
            Select Benchmark
          </InputLabel>

          <Select
            value={this.state.value}
            open={this.state.open}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            inputProps={{ name: 'benchMark', id: 'controlled-open-select' }}
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
