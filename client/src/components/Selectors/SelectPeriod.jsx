// @flow
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

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

@inject('InvestorStore')
@observer
class SelectPeriod extends React.Component<Props, State> {
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
    const { classes } = this.props

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
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
          </Select>
        </FormControl>
      </div >
    );
  }
}

export default withStyles(styles)(SelectPeriod);
