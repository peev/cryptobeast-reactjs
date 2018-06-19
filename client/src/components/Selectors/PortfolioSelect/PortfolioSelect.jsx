// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, MenuItem, FormControl } from 'material-ui';
import Select from 'material-ui/Select';
import { inject, observer } from 'mobx-react';

const styles = (theme: Object) => ({
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
    backgroundColor: '#22252f',
    // backgroundColor: 'rgba(34, 37, 47, 1) !important',
    opacity: '1',
    '&:hover': {
      backgroundColor: '#5B5F70 !important',
    },
    '&:last-child>div': {
      borderBottom: 'none',
    },
  },
  selectedListItem: {
    backgroundColor: '#414555 !important',
    '&:hover': {
      backgroundColor: '#414555 !important',
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
  menuItemContainer: {
    zIndex: '1',
    '&>ul': {
      padding: '0',
    },
  },
  root: {
    '&>svg': {
      paddingRight: '10px',
      fill: '#F6F6F6',
      top: '34px',
    },
  },
  select: {
    width: '200px',
    height: '60px',
    padding: '0 32px',
    marginTop: '16px',
    marginBottom: '16px',
    color: '#F6F6F6',
    borderRight: '1px solid #F6F6F6',
    '&>div': {
      padding: '7px 25px',
      borderBottom: 'none',
    },
  },
});

type Props = {
  classes: PropTypes.object.isRequired,
  PortfolioStore: PropTypes.object,
  UserStore: PropTypes.object,
};

@inject('PortfolioStore', 'UserStore')
@observer
class PortfolioSelect extends React.Component<Props> {
  handleChange = (event: SyntheticEvent) => {
    const { value } = event.target;

    this.props.UserStore.setPortfolio(value);
  };

  render() {
    const { classes, PortfolioStore } = this.props;

    const portfoliosToShow = PortfolioStore.portfolios.map((el: Object, i: number) => {
      return (
        <MenuItem
          classes={{ selected: classes.selectedListItem }}
          className={classes.listItem}
          key={el.id}
          value={el.id}
          index={i + 1}
        // select={i === 1 ? el.id : undefined}
        >
          <div className={classes.listItemContainer}>
            <p className={classes.listItemName}>{el.name}</p>
            <div className={classes.listItemDescription}>
              <p className={classes.listItemDescriptionL}>^4{0.45 + i}%</p>
              <p className={classes.listItemDescriptionR}>{103.90 + i}</p>
            </div>
          </div>
        </MenuItem>
      );
    });

    return (
      <form autoComplete="off" >
        <FormControl className={classes.formControl}>
          <Select
            classes={{
              root: classes.root,
              select: classes.select,
            }}
            value={PortfolioStore.selectedPortfolioId || ''}
            onChange={this.handleChange}
            disableUnderline // removes underline from component
            MenuProps={{ classes: { paper: classes.menuItemContainer } }}
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

export default withStyles(styles)(PortfolioSelect);
