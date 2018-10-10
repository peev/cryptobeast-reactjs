// @flow
import React, { SyntheticEvent } from 'react';

import { FormControl, InputLabel, Select, MenuItem, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import DropDownArrow from '../CustomIcons/DropDown/DropDownArrow';


const styles = (theme: Object) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '100%',
    '& .is-open > .Select-control .Select-arrow-zone svg': {
      position: 'relative',
      left: '-8px',
      transform: 'rotate(180deg)',
    },
  },
  select: {
    '& .Select-placeholder': {
      top: '2px',
    },
    '& .Select-placeholder:hover': {
      borderBottom: '1px solid #000',
    },
    '& .Select-clear': {
      position: 'relative',
      top: '2px',
      right: '5px',
    },
    '& .Select-arrow-zone svg': {
      fontSize: '15px',
      paddingRight: '8px',
      position: 'relative',
      top: '4px',
    },
  },
});

type Props = {
  classes: Object,
  handleChange: PropTypes.func,
  PortfolioStore: Object,
  value: string,
  style: Object,
};


@inject('InvestorStore', 'PortfolioStore')
@observer
class SelectInvestor extends React.Component<Props> {
  handleChange = (event: SyntheticEvent) => {
    if (event) {
      this.props.handleChange(event.target.value);
    } else {
      this.props.handleChange('');
    }
  };

  arrowRenderer = () => (
    <DropDownArrow />
  );

  render() {
    const { classes, PortfolioStore, value, style } = this.props;
    const { currentPortfolioInvestors } = PortfolioStore;
    const investorsToShow = [];
    currentPortfolioInvestors.map((investor: object) => ({ value: investor.id, label: investor.fullName }))
      .forEach((investor: object) => {
        investorsToShow.push(investor);
      });
    return (
      <div autoComplete="off" >
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          <InputLabel htmlFor="benchMark">
            Select investor*
          </InputLabel>
          <Select
            value={value}
            // onOpen={this.handleOpen}
            onChange={this.handleChange}
            onClose={this.handleClose}
            inputProps={{ id: 'controlled-open-select' }}
          >
            {investorsToShow.map((investor: Object) => (
              <MenuItem value={investor.value} key={investor.value}>
                <em>{investor.label}</em>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div >
    );
  }
}

export default withStyles(styles)(SelectInvestor);
