// @flow
import React from 'react';
import { Edit } from '@material-ui/icons';
import { withStyles, Grid, Input } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { inject, observer } from 'mobx-react';

import Button from '../CustomButtons/Button';
import IconButton from '../CustomButtons/IconButton';

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
    width: '270px',
    minWidth: '200px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '400',
    textAlign: 'center',
  },
  input: {
    display: 'block',
    width: '105px',
    margin: '20px auto',
  },
});

type Props = {
  classes: Object,
  UserStore: Object,
};

type State = {
  open: boolean,
};

@inject('UserStore')
@observer
class ChangeTime extends React.Component<Props, State> {
  name: ?React.Ref<any> = null;

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
    this.props.UserStore.updateClosingTime();
    this.handleClose();
  };

  handleSetTimeValue = (event: SyntheticEvent) => {
    event.preventDefault();
    const inputValue = event.target.value;

    this.props.UserStore.setTimeValue(inputValue);
  };

  render() {
    const { classes, UserStore } = this.props;

    return (
      <div style={{ display: 'inline-block' }}>
        <IconButton
          color="primary"
          customClass="edit"
          onClick={this.handleOpen}
          disabled={UserStore.timeType}
        >
          <Edit style={{ width: '.8em', height: '.8em' }} />
        </IconButton>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Grid container>
              <Grid item xs={12} sm={12} md={12} className={classes.container}>
                <Typography
                  variant="title"
                  id="modal-title"
                  className={classes.modalTitle}
                >
                  Set Time
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={12} className={classes.container}>
                <Input
                  name="time"
                  label="time"
                  type="time"
                  className={classes.input}
                  value={UserStore.timeValue}
                  onChange={(е: SyntheticEvent) => this.handleSetTimeValue(е)}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} className={classes.container}>
                <Button
                  color="primary"
                  style={{ display: 'inline-flex', float: 'left', marginRight: '50px' }}
                  onClick={this.handleClose}
                >
                  Cancel
                </Button>

                <Button
                  color="primary"
                  style={{ display: 'inline-flex', float: 'right' }}
                  onClick={this.handleSave}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </div >
    );
  }
}


// We need an intermediary variable for handling the recursive nesting.
const UpdatePortfolioModalWrapped = withStyles(styles)(ChangeTime);

export default UpdatePortfolioModalWrapped;
