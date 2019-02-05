// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, MenuItem, FormControl } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { inject, observer } from 'mobx-react';
import DropDownArrow from '../../CustomIcons/DropDown/DropDownArrow';
import portfolioSelectStyles from './PortfolioSelectStyles';
import BigNumberService from '../../../services/BigNumber';


type Props = {
  classes: PropTypes.object.isRequired,
  PortfolioStore: PropTypes.object,
  PortfolioStore: {
    portfolios: Array<Object>,
    selectPortfolio: Function,
    loadData: Function,
  },
  // UserStore: PropTypes.object,
};

@inject('PortfolioStore', 'UserStore')
@observer
class PortfolioSelect extends React.Component<Props> {
  handleChange = (event: SyntheticEvent) => {
    const { value } = event.target;
    // this.props.UserStore.setPortfolio(value);
    this.props.PortfolioStore.selectPortfolio(value, true);

    // TODO FOR DELETE
    // this.updateUserDataInterval = null;
  };

  render() {
    const { classes, PortfolioStore } = this.props;
    const portfoliosToShow = PortfolioStore.stats.map((el: Object, i: number) => (
      <MenuItem
        classes={{ selected: classes.selectedListItem }}
        className={classes.listItem}
        key={el.id}
        value={el.id}
        index={i + 1}
      // select={i === 1 ? el.id : undefined}
      >
        <div className={classes.listItemContainer}>
          <div className={classes.listItemName}>{el.name || el.address}</div>
          <div className={classes.listItemDescription}>
            <div className={el.totalProfitLost >= 0 ? classes.positive : classes.negative}>
              <DropDownArrow className={el.totalProfitLost >= 0 ? classes.upArrow : classes.downArrow} />
              {BigNumberService.floor(el.totalProfitLost)}%
            </div>
            <div>${BigNumberService.floor(el.portfolioCostInUSD)}</div>
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

export default withStyles(portfolioSelectStyles)(PortfolioSelect);
