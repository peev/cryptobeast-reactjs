import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'material-ui';
import { Icon } from 'material-ui-icons';
import { withStyles } from 'material-ui/styles';
import Modal from 'material-ui/Modal';
import axios from 'axios';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
//import DatePicker from 'material-ui/DatePicker';
<<<<<<< HEAD
import SelectCurrency from '../../PortSelect/SelectCurrency';
import Button from '../../CustomButtons/Button';
=======
import SelectCurrency from '../../Selectors/SelectCurrency';
import Button from "../../CustomButtons/Button";
>>>>>>> b05afb2d716368518869ac810369674ee1b556f0

import { inject, observer } from 'mobx-react';

const getModalStyle = () => {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`
  };
};

const styles = theme => ({
  paper: {
    position: 'absolute',
    minWidth: '100px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4
  }
});

@inject('InvestorStore')
@observer
class AddInvestor extends React.Component {
  state = {
    open: false,

    founder: false,

    fullName: '',
    telephone: '',
    depAmount: 0,
    depUSDEquiv: 0,
    sharePriceAtEntry: 0,

    email: ' ',
    managementFee: 0,
    purchasedShares: 0
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleTelephoneChange = ev => this.props.InvestorStore.setTelephone(ev.target.value);

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div>
          <Button onClick={this.handleOpen} color="primary">
            {' '}
            Add new investor
          </Button>
        </div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <form
            style={getModalStyle()}
            className={classes.paper}
            onSubmit={() => this.handleSave}
          >
            <Typography
              variant="title"
              id="modal-title"
              style={{ fontSize: '18px', fontWeight: '400' }}
            >
              Add a new investor
              <Checkbox
                checked={this.state.founder}
                onChange={this.handleChange('founder')}
                color="primary"
              />
            </Typography>
            <div className={classes.flex}>
              <div style={{ display: 'inline-block', marginRight: '10px' }}>
                <TextField
                  placeholder="Full name"
                // inputRef={el =>this.name = el}
                />
                <br />
                <TextField
                  placeholder="Telephone"
                  onChange={this.handleTelephoneChange}
                // inputRef={el =>this.name = el}
                />
                <br />
                <TextField
                  placeholder="Depositet Amount"
                // inputRef={el =>this.name = el}
                />
                <br />
                <TextField
                  placeholder="Deposited USD Equiv."
                // inputRef={el =>this.name = el}
                />
                <br />
                <TextField placeholder="Share price at entry Date" />
              </div>
              <div style={{ display: 'inline-block' }}>
                <TextField
                  placeholder="Email Adress "
                // inputRef={el =>this.name = el}
                />
                <br />
                <TextField
                  placeholder="Date of Entry"
                // inputRef={el =>this.name = el}
                />

                <br />
                <SelectCurrency />
                <TextField
                  placeholder="Management Fee %"
                // inputRef={el =>this.name = el}
                />
                <br />
                <TextField
                  placeholder="Purchased Shares"
                // inputRef={el =>this.name = el}
                />
              </div>
            </div>

            <br />

            <Button
              style={{ display: 'inline-flex' }}
              onClick={this.handleClose}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              style={{ display: 'inline-flex' }}
              onClick={this.handleSave}
              color="primary"
              type="submit"
            >
              {' '}
              Save
            </Button>
          </form>
        </Modal>
      </div>
    );
  }
}

AddInvestor.propTypes = {
  classes: PropTypes.object.isRequired
};

const AddInvestorWrapped = withStyles(styles)(AddInvestor);

export default AddInvestorWrapped;
