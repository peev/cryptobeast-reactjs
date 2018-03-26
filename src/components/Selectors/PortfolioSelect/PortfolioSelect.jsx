import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

import { inject, observer } from 'mobx-react';

import './PortfolioSelect.css';

const styles = theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    // margin: theme.spacing.unit,
    minWidth: 150,
    float: 'left',
  },
  inputLabel: {
    left: 'calc(100% - 189px)',
    color: '#F6F6F6',
    zIndex: '1',
  },
  listItem: {
    display: 'flex',
    height: '100%',
    padding: '0 16px',
    backgroundColor: '#22252f',
    '&:hover': {
      backgroundColor: '#1D2028',
    },
    '&:last-child>div': {
      borderBottom: 'none',
    },
  },
  listItemContainer: {
    display: 'flex',
    width: '100%',
    padding: '16px 0',
    paddingLeft: '25px',
    borderBottom: '1px solid #F6F6F6',
    flexDirection: 'column',
  },
  listItemName: {
    color: '#F6F6F6',
    margin: '0',
  },
  listItemDescription: {
    display: 'flex',
  },
  listItemDescriptionL: {
    margin: '0',
    marginRight: '20px',
    color: '#3C7B69',
    fontWeight: 'bolder',
  },
  listItemDescriptionR: {
    margin: '0',
    color: '#D0D0D0',
    fontSize: '14px',
  },
});

@inject('PortfolioStore')
@observer
class PortfolioSelect extends React.Component {
  state = {
    selectedPortfolioId: '',
    open: false,
  };


  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    const { value, index } = event.target;
    // const index = event.target.index;
    this.props.PortfolioStore.selectPortfolio(value, index);

    this.setState({ [event.target.name]: value }); // 'selectedPortfolioId: event.target.value' does same as above
  };

  render() {
    const { classes, PortfolioStore } = this.props;
    const currentPortfolios = PortfolioStore.getAllPortfolios;

    const portfoliosToShow = Object.keys(currentPortfolios)
      .map((port, i) => (
        <MenuItem
          className={classes.listItem}
          key={currentPortfolios[port].id}
          value={currentPortfolios[port].id}
          index={i}
        >
          <div className={classes.listItemContainer}>
            <p className={classes.listItemName}>{currentPortfolios[port].name}</p>
            <div className={classes.listItemDescription}>
              <p className={classes.listItemDescriptionL}>^0.45%</p>
              <p className={classes.listItemDescriptionR}>1103.90</p>
            </div>
          </div>
        </MenuItem>
      ));

    const nothingToShow = (
      <MenuItem
        value={1}
        className={classes.listItem}
      >
        <p>None</p>
      </MenuItem>
    );

    return (
      <form autoComplete="off">

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="controlled-open-select" className={classes.inputLabel}>Select Portfolio</InputLabel>

          <Select
            className="headerListSelect"
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
            {portfoliosToShow.length > 0 ? portfoliosToShow : nothingToShow}
          </Select>
        </FormControl>
      </form>
    );
  }
}

PortfolioSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PortfolioSelect);