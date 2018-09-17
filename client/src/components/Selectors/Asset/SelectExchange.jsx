// @flow
import React, { SyntheticEvent } from 'react';
import { withStyles, FormControl } from '@material-ui/core';
import Select from 'react-select';
import constants from '../../../variables/constants.json';
import DropDownArrow from '../../CustomIcons/DropDown/DropDownArrow';


const styles = () => ({
  formControl: {
    minWidth: '100%',
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
  value: string,
  label: string,
  style: Object,
};

type State = {
  open: boolean,
};

class SelectExchange extends React.Component<Props, State> {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

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
    const { classes, value, label, style } = this.props;
    const allExchanges = constants.services.map((name: string) => ({ value: name, label: name }));

    return (
      <div autoComplete="off">

        <FormControl className={classes.formControl}>
          {/* <InputLabel htmlFor="controlled-open-select">
          Select Exchange
          </InputLabel> */}

          <Select
            name="select exchange"
            placeholder={label}
            open={this.state.open}
            value={value}
            onClose={this.handleClose}
            onChange={this.handleChange}
            inputProps={{
              name: 'exchangeId',
              id: 'controlled-open-select',
            }}
            options={allExchanges}
            style={style}
            arrowRenderer={this.arrowRenderer}
            className={classes.select}
          />
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(SelectExchange);
