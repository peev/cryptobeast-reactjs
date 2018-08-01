// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles } from 'material-ui/styles';
// import { InputLabel } from 'material-ui/Input';
import Select from 'react-select';

import { FormControl } from 'material-ui/Form';
// import Select from 'material-ui/Select';

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
    '& .Select-placeholder:hover, &.is-focused': {
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
  // dropDownContainer: {
  //   '& .Select-menu-outer': {
  //     width: '90.5%',
  //   },
  // },
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
      this.props.handleChange(event.value);
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
          <Select
            name="investor"
            placeholder="Select investor*"
            // open={this.state.open}
            value={value}
            onClose={this.handleClose}
            // onOpen={this.handleOpen}
            onChange={this.handleChange}
            options={investorsToShow}
            style={{
              ...style,
              width: '100%',
            }}
            inputProps={{
              id: 'controlled-open-select',
            }}
            arrowRenderer={this.arrowRenderer}
            className={classes.select}
          />
        </FormControl>
      </div >
    );
  }
}

export default withStyles(styles)(SelectInvestor);
