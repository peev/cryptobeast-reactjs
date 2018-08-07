// @flow
import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import { ValidatorForm } from 'react-material-ui-form-validator';

import { Close } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';
import IconButton from '../CustomButtons/IconButton';

import Button from '../CustomButtons/Button';

function getModalStyle() {
  const top = 45;
  const left = 41;
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}

const styles = (theme: Object) => ({
  paper: {
    position: 'absolute',
    minWidth: '300px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4,
  },
  headerButtonContainer: {
    float: 'right',
    marginTop: '-35px',
    marginRight: '40px',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '400',
    textAlign: 'center',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
});

type Props = {
  classes: Object,
  onSave: Function,
  message: string
};


type State = {
  open: boolean,
};

@inject('InvestorStore', 'PortfolioStore', 'NotificationStore')
@observer
class ConfirmationModal extends React.Component<Props, State> {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSave = () => {
    this.props.onSave();
    this.handleClose();
  };

  render() {
    const {
      classes,
      message,
    } = this.props;

    return (
      <React.Fragment>
        <IconButton
          // className={classes.headerButton}
          onClick={this.handleOpen}
          color="primary"
          customClass="remove"
        >
          <Close />
        </IconButton>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <ValidatorForm
            // ref="form"
            onSubmit={this.handleSave}
            // onError={errors => console.log(errors)}
            style={getModalStyle()}
            className={classes.paper}
          >
            <Typography
              variant="title"
              id="modal-title"
              className={classes.modalTitle}
            >
              {message}
            </Typography>

            <br />
            <div className={classes.buttonsContainer}>
              {/* Cancel BUTTON */}
              <Button
                style={{ display: 'inline-flex', marginRight: '50px', float: 'left' }}
                onClick={this.handleClose}
                color="primary"
              >
                {' '}
                No
              </Button>

              {/* SAVE BUTTON */}
              <Button
                style={{ display: 'inline-flex', float: 'right' }}
                // onClick={this.handleSave}
                color="primary"
                type="submit"
              >
                {' '}
                Yes
              </Button>
            </div>
          </ValidatorForm>
        </Modal>
      </React.Fragment>
    );
  }
}

// We need an intermediary variable for handling the recursive nesting.
const ConfirmationModalWrapped = withStyles(styles)(ConfirmationModal);

export default ConfirmationModalWrapped;
