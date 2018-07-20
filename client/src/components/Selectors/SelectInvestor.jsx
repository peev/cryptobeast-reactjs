// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles } from 'material-ui/styles';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';


// import Select from 'react-select';

import { inject, observer } from 'mobx-react';

const styles = (theme: Object) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '100%',
  },
  select: {
    width: '90%',
    '& svg': {
      right: '2px',
    },
    '&>div>div': {
      paddingLeft: '10px',
    },
  },
  selectLabel: {
    paddingLeft: '10px',

  },
});

type Props = {
  classes: Object,
  handleChange: PropTypes.func,
  PortfolioStore: Object,
};


@inject('InvestorStore', 'PortfolioStore')
@observer
class SelectInvestor extends React.Component<Props> {
  state = {
    investorName: '',
  };

  handleChange = (event: SyntheticEvent) => {
    this.setState({ investorName: event.target.value || '' });
    if (event) {
      this.props.handleChange(event.target.value);
    } else {
      this.props.handleChange('');
    }
  };

  render() {
    const { classes, PortfolioStore } = this.props;
    const { currentPortfolioInvestors } = PortfolioStore;
    const investorsToShow = [];
    currentPortfolioInvestors.map((investor: object) => ({ value: investor.id, label: investor.fullName }))
      .forEach((investor: object) => {
        investorsToShow.push(investor);
      });

    return (
      <div autoComplete="off" >
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          <InputLabel htmlFor="age-simple" className={classes.selectLabel}>Select investor*</InputLabel>
          <Select
            value={this.state.investorName}
            onChange={this.handleChange}
            className={classes.select}
          >
            <MenuItem>
              <em>All investors</em>
            </MenuItem>
            {investorsToShow.map((investor: object) => (
              <MenuItem
                key={investor.value}
                value={investor.value}
              >
                {investor.label}
              </MenuItem>))}
          </Select>
        </FormControl>
      </div >
    );
  }
}

export default withStyles(styles)(SelectInvestor);
