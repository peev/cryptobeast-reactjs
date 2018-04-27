/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, MenuItem } from 'material-ui';
import Typography from 'material-ui/Typography';
import Input from 'material-ui/Input';
import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown';
import CancelIcon from 'material-ui-icons/Cancel';
import ArrowDropUpIcon from 'material-ui-icons/ArrowDropUp';
import ClearIcon from 'material-ui-icons/Clear';
import Chip from 'material-ui/Chip';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { inject, observer } from 'mobx-react';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: '16px',
    // height: 250,
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
});

class Option extends Component {
  handleClick = (event) => {
    this.props.onSelect(this.props.option, event);
  };

  render() {
    const { children, isFocused, isSelected, onFocus } = this.props;

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {children}
      </MenuItem>
    );
  }
}

@inject('MarketStore')
@observer
// eslint-disable-next-line react/no-multi-comp
class SelectWrapped extends Component {
  render() {
    const { classes, MarketStore, value, ...other } = this.props;
    console.log(classes, MarketStore, value, ...other);
    return (
      <Select
        optionComponent={Option}
        noResultsText={<Typography>{'No results found'}</Typography>}
        arrowRenderer={(arrowProps) => {
          return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
        }}
        clearRenderer={() => <ClearIcon />}
        valueComponent={(valueProps) => {
          const { valueOfItem, children, onRemove } = valueProps;
          console.log(valueProps)

          const onDelete = (event) => {
            event.preventDefault();
            event.stopPropagation();
            onRemove(valueOfItem);
          };

          if (onRemove) {
            return (
              <Chip
                tabIndex={-1}
                label={children}
                className={classes.chip}
                deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
                onDelete={onDelete}
              />
            );
          }
          // MarketStore.selectedCurrencyBasicAsset
          return <div className="Select-value">{valueProps}</div>;
        }}
        {...other}
      />
    );
  }
}

export default withStyles(styles)(SelectWrapped);
