// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
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
    const options = [
      { value: '1d', label: '1d' },
      { value: '1m', label: '1m' },
      { value: '1y', label: '1y' }
    ];

    return (
      <FormControl className={classes.formControl}>
        <label htmlFor="period">
          Select Period
        </label>

        <Select
          value={Analytics.selectedTimeInPerformance}
          open={this.state.open}
          onOpen={this.handleOpen}
          onClose={this.handleClose}
          onChange={this.handleChange}
          options={options}
          inputProps={{ id: 'period' }}
        />
      </FormControl>
    );
  }
}


export default withStyles(styles)(SelectPeriod);
