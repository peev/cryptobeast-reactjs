// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles } from 'material-ui/styles';
// import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
// import Select from 'material-ui/Select';
import { SelectValidator } from 'react-material-ui-form-validator';


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
});

type Props = {
  classes: Object,
  InvestorStore: Object,
  PortfolioStore: Object,
};


@inject('InvestorStore', 'PortfolioStore')
@observer
class SelectInvestor extends React.Component<Props> {
  handleChange = (event: SyntheticEvent) => {
    const { value } = event.target;
    this.props.InvestorStore.selectInvestor(value);
  };


  render() {
    const { classes, PortfolioStore } = this.props;
    const { currentPortfolioInvestors } = PortfolioStore;
    const investorsToShow = [];

    currentPortfolioInvestors.forEach((investor: Object, i: number) => {
      investorsToShow.push((
        <MenuItem
          key={investor.id}
          value={investor.id}
          index={i}
        >
          <em>{investor.fullName}</em>
        </MenuItem>
      ));
    });

    return (
      <div autoComplete="off" >
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          {/* <InputLabel htmlFor="controlled-open-select">
            Investor
          </InputLabel> */}
          <SelectValidator
            name="investor"
            label="Select investor*"
            // open={this.state.open}
            value={this.props.InvestorStore.selectedInvestorId || ''}
            onClose={this.handleClose}
            // onOpen={this.handleOpen}
            onChange={this.handleChange}
            style={{ width: '95%' }}
            inputProps={{
              id: 'controlled-open-select',
            }}
            validators={['required']}
            errorMessages={['this field is required']}
          >

            {investorsToShow.length > 0 ? investorsToShow :
            <MenuItem value={1}><em>None</em></MenuItem>}

          </SelectValidator>
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(SelectInvestor);
