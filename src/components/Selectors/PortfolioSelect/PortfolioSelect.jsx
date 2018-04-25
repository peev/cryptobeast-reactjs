import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MenuItem, FormControl } from 'material-ui';
import Select from 'material-ui/Select';

import { inject, observer } from 'mobx-react';

import './PortfolioSelect.css';

const styles = theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    minWidth: 150,
    float: 'left',
  },
  inputLabel: {
    color: '#F6F6F6',
    padding: '8px 27px',
    width: '100%',
    borderBottom: '1px solid #F6F6F6',
    '& div p': {
      margin: '10px 0',
    },
  },
  listItem: {
    display: 'flex',
    height: '100%',
    padding: '0 16px',
    backgroundColor: '#22252f !important',
    // backgroundColor: 'rgba(34, 37, 47, 1) !important',
    opacity: '1',
    '&:hover': {
      backgroundColor: '#414555 !important',
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

@inject('PortfolioStore', 'UserStore')
@observer
class PortfolioSelect extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleChange = (event) => {
    const { value, index } = event.target;

    this.props.UserStore.setPortfolio(value);
  };

  render() {
    const { classes, PortfolioStore } = this.props;
    const portfoliosToShow = [];

    // 1st value is empty, this is required by the Select component
    portfoliosToShow.push(
      <MenuItem
        className={classes.listItem}
        key={0}
        value=''
        index={0}
        disabled>
        <div className={classes.inputLabel}>
          <div>
            <p>Select Portfolio</p>
          </div>
        </div>
      </MenuItem>
    );

    const currentPortfolios = PortfolioStore.portfolios;

    currentPortfolios.forEach((el, i) => {
      portfoliosToShow.push(
        <MenuItem
          className={classes.listItem}
          key={el.id}
          value={el.id}
          index={i + 1}
          select={i === 1 ? el.id : undefined}
        >
          <div className={classes.listItemContainer}>
            <p className={classes.listItemName}>{el.name}</p>
            <div className={classes.listItemDescription}>
              <p className={classes.listItemDescriptionL}>^4{0.45 + i}%</p>
              <p className={classes.listItemDescriptionR}>{103.90 + i}</p>
            </div>
          </div>
        </MenuItem>
      )
    });

    return (
      <form autoComplete="off" >
        <FormControl className={classes.formControl}>
          <Select
            className="headerListSelect"
            value={PortfolioStore.selectedPortfolioId || ''}
            onChange={this.handleChange}
            displayEmpty // uses the 1st element as placeholder
            disableUnderline // removes underline from component
            inputProps={{
              name: 'selectedPortfolioId',
              id: 'controlled-open-select',
            }}
          >
            {portfoliosToShow}
          </Select>
        </FormControl>
      </form>
    );
  }
}

PortfolioSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  PortfolioStore: PropTypes.object,
  UserStore: PropTypes.object
};

export default withStyles(styles)(PortfolioSelect);
