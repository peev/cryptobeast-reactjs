// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, MenuItem, FormControl } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { inject, observer } from 'mobx-react';
import DropDownArrow from '../../CustomIcons/DropDown/DropDownArrow';
import portfolioSelectStyles from './PortfolioSelectStyles';


type Props = {
  classes: PropTypes.object.isRequired,
  PortfolioStore: PropTypes.object,
  UserStore: PropTypes.object,
};

@inject('PortfolioStore', 'UserStore', 'ApiAccountStore')
@observer
class PortfolioSelect extends React.Component<Props> {
  handleChange = (event: SyntheticEvent) => {
    const { value } = event.target;
    // this.props.UserStore.setPortfolio(value);
    this.props.PortfolioStore.selectPortfolio(value);

    // TODO FOR DELETE
    // this.updateUserDataInterval = null;
    // if (this.props.ApiAccountStore.convertUserApis.length > 0) {
    //   this.props.ApiAccountStore.syncUserApiData();

    //   this.updateUserDataInterval = setInterval(() => this.props.ApiAccountStore.syncUserApiData(), 30000);
    // }
  };

  // TODO FOR DELETE
  // componentDidMount() {
  //   if (this.props.ApiAccountStore.convertUserApis.length > 0) {
  //     this.props.ApiAccountStore.syncUserApiData();
  //     this.updateUserDataInterval = setInterval(() => this.props.ApiAccountStore.syncUserApiData(), 30000);
  //   }
  // }

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
          <div className={classes.listItemName}>{el.userAddress}</div>
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

export default withStyles(portfolioSelectStyles)(PortfolioSelect);
