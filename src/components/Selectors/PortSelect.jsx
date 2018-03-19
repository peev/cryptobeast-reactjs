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
    this.setState({ [event.target.name]: event.target.value }); // 'selectedPortfolioId: event.target.value' does same as above
  };

  render() {
    const { classes, PortfolioStore } = this.props;

    const portfoliosToShow = Object.keys(PortfolioStore.portfolios)
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

    // const noPortfolios = <MenuItem value={1}><em>None</em></MenuItem>;

    return (
      <form autoComplete="off">

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="controlled-open-select" stlye={{color:'#FFF'}}>Select Portfolio</InputLabel>

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
            {portfoliosToShow.length > 0 ? portfoliosToShow : <MenuItem value={1}><em>None</em></MenuItem>}
            {/* {portfoliosToShow} */}
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
