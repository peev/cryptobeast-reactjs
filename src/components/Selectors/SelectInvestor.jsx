import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
// import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
// import Select from 'material-ui/Select';
import { SelectValidator } from 'react-material-ui-form-validator';


import { inject, observer } from 'mobx-react';

const styles = theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '100%',
  },
});

@inject('InvestorStore', 'PortfolioStore')
@observer
class SelectInvestor extends React.Component {

  handleChange = (event) => {
    const { value } = event.target;
    this.props.InvestorStore.selectInvestor(value);
  };


  render() {
    const { classes, PortfolioStore } = this.props;
    const investors = PortfolioStore.currentPortfolioInvestors;
    const investorsToShow = [];

    investors.forEach((element, i) => {
      investorsToShow.push((
        <MenuItem
          key={element.id}
          value={element.id}
          index={i}
        >
          <em>{element.fullName}</em>
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
            label="select investor"
            // open={this.state.open}
            value={this.props.InvestorStore.selectedInvestorId || ''}
            onClose={this.handleClose}
            // onOpen={this.handleOpen}
            onChange={this.handleChange}
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

SelectInvestor.propTypes = {
  classes: PropTypes.object.isRequired,
  InvestorStore: PropTypes.object,
};

export default withStyles(styles)(SelectInvestor);
