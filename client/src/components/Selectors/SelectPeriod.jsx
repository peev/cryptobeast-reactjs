// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { InputLabel } from '@material-ui/core/Input';
import { MenuItem } from '@material-ui/core/Menu';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
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
    const { classes } = this.props;
    const options = [
      { value: 'None', label: 'None' }
    ];

    return (
      <div autoComplete="off">
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          <label htmlFor="SelectPeriod">
            Select Period
          </label>

          <Select
            value={this.state.value}
            open={this.state.open}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            options={options}
            inputProps={{ name: 'SelectPeriod', id: 'SelectPeriod' }}
          />
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(SelectPeriod);
