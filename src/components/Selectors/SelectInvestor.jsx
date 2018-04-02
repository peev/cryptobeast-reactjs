import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

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

@inject('InvestorStore')
@observer
class SelectInvestor extends React.Component {
  state = {
    selectedInvestorId: '',
    open: false,
  };

  componentDidMount() {
    this.props.InvestorStore.getPortfolio();
  }

  handleChange = (event) => {
    const { value, index } = event.target;

    this.props.InvestorStore.selectInvestor(value, index);
    this.setState({ [event.target.name]: value });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { classes, InvestorStore } = this.props;
    let investorsToShow = [];

    if (InvestorStore.selectedInvestors) {
      const investors = InvestorStore.selectedInvestors;

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
    }

    return (
      <div autoComplete="off" >
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          <InputLabel htmlFor="controlled-open-select">
            Investor
          </InputLabel>
          <Select
            open={this.state.open}
            value={this.state.selectedInvestorId}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
            onChange={this.handleChange}
            inputProps={{
              name: 'selectedInvestorId',
              id: 'controlled-open-select',
            }}
          >

            {investorsToShow.length > 0 ? investorsToShow : <MenuItem value={1}><em>None</em></MenuItem>}

          </Select>
        </FormControl>
      </div>
    );
  }
}

SelectInvestor.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectInvestor);
