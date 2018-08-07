// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, MenuItem, FormControl } from 'material-ui';
import Select from 'material-ui/Select';
import { inject, observer } from 'mobx-react';
import DropDownArrow from '../../CustomIcons/DropDown/DropDownArrow';

const styles = (theme: Object) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    minWidth: 150,
    // float: 'left',
    paddingLeft: '48px',
  },
  listItem: {
    height: '100%',
    padding: '15px 15px 15px 30px',
    backgroundColor: '#22252f',
    '&:hover': {
      backgroundColor: '#143141 !important',
    },
  },
  selectedListItem: {
    backgroundColor: '#143141 !important',
  },
  listItemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  listItemName: {
    color: '#F6F6F6',
    margin: '0 0 10px 0',
  },
  listItemDescription: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: '-15px',
    '& div': {
      margin: '0',
    },
    '& :first-child': {
      color: '#39b493',
      fontWeight: '700',
    },
    '& :last-child': {
      color: '#D0D0D0',
      fontSize: '14px',
    },
  },
  menuItemContainer: {
    marginTop: '64px',
    '&>ul': {
      padding: '0',
    },
  },
  root: {
    '&>svg': {
      paddingRight: '10px',
      fill: '#F6F6F6',
      top: '14px',
    },
  },
  select: {
    display: 'flex',
    alignItems: 'center',
    height: '60px',
    // width: '150px',
    padding: '10px 30px',
    color: '#F6F6F6',
    '&>div': {
      width: '100%',
      padding: '0',
      borderBottom: 'none',
    },
  },
  upArrow: {
    position: 'relative',
    top: '1px',
    transform: 'rotate(180deg)',
    padding: '0 7px',
    '& polyline': {
      stroke: '#39b493',
    },
  },
  dropDownArrow: {
    position: 'absolute',
    right: '-5px',
    pointerEvents: 'none',
    fontSize: '17px',
    top: '19px !important',
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

    const portfoliosToShow = PortfolioStore.portfolios.map((el: Object, i: number) => (
      <MenuItem
        classes={{ selected: classes.selectedListItem }}
        className={classes.listItem}
        key={el.id}
        value={el.id}
        index={i + 1}
      // select={i === 1 ? el.id : undefined}
      >
        <div className={classes.listItemContainer}>
          <div className={classes.listItemName}>{el.name}</div>
          <div className={classes.listItemDescription}>
            <div style={{ padding: '0 15px', margin: '0 -7px' }}>
              <DropDownArrow className={classes.upArrow} />
              4{0.45 + i}%
            </div>
            <div>{103.90 + i}</div>
          </div>
        </div>
      </MenuItem>
    ));

    return (
      <form autoComplete="off">
        <FormControl className={classes.formControl}>
          <Select
            classes={{
              root: classes.root,
              select: classes.select,
            }}
            value={PortfolioStore.selectedPortfolioId}
            onChange={this.handleChange}
            disableUnderline // removes underline from component
            MenuProps={{ classes: { paper: classes.menuItemContainer } }}
            inputProps={{
              name: 'selectedPortfolioId',
              id: 'controlled-open-select',
            }}
            IconComponent={() => <DropDownArrow className={classes.dropDownArrow} />}
          >
            {portfoliosToShow}
          </Select>
        </FormControl>
      </form>
    );
  }
}

export default withStyles(styles)(PortfolioSelect);
