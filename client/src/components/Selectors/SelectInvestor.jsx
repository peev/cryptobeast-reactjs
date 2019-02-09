// @flow
import React, { SyntheticEvent } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Select from 'react-select';
import FormControl from '@material-ui/core/FormControl';

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
  value: string,
  isClearable: boolean,
  currentPortfolioInvestors: Array<Object>,
};

@inject('InvestorStore')
@observer
class SelectInvestor extends React.Component<Props> {
  constructor() {
    super();
    this.btnRef = React.createRef();
  }

  componentWillUpdate(nextProps: Object) {
    if (nextProps.currentPortfolioInvestors !== this.props.currentPortfolioInvestors) {
      this.btnRef.current.select.clearValue();
    }
  }

  handleChange = (event: SyntheticEvent) => {
    if (event) {
      this.props.handleChange({
        label: event.label,
        value: event.value,
      });
    } else {
      this.props.handleChange('');
    }
  };

  arrowRenderer = () => (
    <DropDownArrow />
  );

  render() {
    const { classes, value, isClearable } = this.props;
    const investorsToShow = [];
    this.props.currentPortfolioInvestors.map((investor: object) => ({ value: investor.id, label: investor.name }))
      .forEach((investor: object) => {
        investorsToShow.push(investor);
      });

    return (
      <div autoComplete="off" >
        <FormControl className={classes.formControl} style={{ margin: 0 }}>
          <Select
            ref={this.btnRef}
            name="investor"
            placeholder="Select investor*"
            // open={this.state.open}
            value={value}
            onClose={this.handleClose}
            // onOpen={this.handleOpen}
            onChange={this.handleChange}
            options={investorsToShow}
            isClearable={isClearable}
            styles={{
              ...styles,
              width: '100%',
              control: (base: any) => ({
                ...base,
                '&:hover': { borderColor: 'gray' }, // border style on hover
                border: '1px solid lightgray', // default border color
                boxShadow: 'none', // no box-shadow
              }),
            }}
            inputProps={{
              id: 'controlled-open-select',
            }}
            arrowRenderer={this.arrowRenderer}
            className={classes.select}
          />
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(SelectInvestor);
