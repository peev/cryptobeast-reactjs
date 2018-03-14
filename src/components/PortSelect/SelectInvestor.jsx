import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

const styles = theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: '200px',
  },
});

class SelectCurrency extends React.Component {
  state = {
    age: '',
    open: false,
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { classes } = this.props;

    return (
      <form autoComplete="off">
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          <InputLabel htmlFor="controlled-open-select">
            Investor
          </InputLabel>
          <Select
            open={this.state.open}
            value={this.state.age}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
            onChange={this.handleChange}
            inputProps={{
              name: 'age',
              id: 'controlled-open-select',
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
          </Select>
        </FormControl>
      </form>
    );
  }
}

SelectCurrency.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectCurrency);
