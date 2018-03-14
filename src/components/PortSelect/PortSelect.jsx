import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

import { inject, observer } from 'mobx-react';

const styles = theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,

  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 150,
    float: 'left',
  },
});

@inject('PortfolioStore')
@observer
class ControlledOpenSelect extends React.Component {
  state = {
    selectedPortfolioId: '',
    open: false,
    portfoliosSize: null,
  };

  componentDidMount() {
    console.log(this.state.arePortfoliosLoaded);
    const { PortfolioStore } = this.props;

    PortfolioStore.getAllPortfolios();
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    // this.setState({ selectedPortfolioId: event.target.value }); // does same as above
  };

  render() {
    const { classes, PortfolioStore } = this.props;
    let portfoliosNames;

    if (PortfolioStore.portfolios) {
      console.log(PortfolioStore.portfolios);

      portfoliosNames = Object.keys(PortfolioStore.portfolios)
        .map((port) => {
          return (
            <MenuItem
              key={PortfolioStore.portfolios[port].id}
              value={PortfolioStore.portfolios[port].id}
            >
              <em>{PortfolioStore.portfolios[port].name}</em>
            </MenuItem>
          );
        });
    }

    // console.log('----PortSelect----', this.props.PortfolioStore.portfolios['0']);

    return (
      <form autoComplete="off">

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="controlled-open-select">Select Portfolio</InputLabel>

          <Select
            open={this.state.open}
            value={this.state.selectedPortfolioId}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
            onChange={this.handleChange}
            inputProps={{
              name: 'selectedPortfolioId',
              id: 'controlled-open-select',
            }}
          >
            {portfoliosNames}
            {/* <MenuItem value="">
              <em>{PortfolioStore.name}</em>
            </MenuItem> */}
          </Select>
        </FormControl>
      </form>
    );
  }
}

ControlledOpenSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ControlledOpenSelect);
