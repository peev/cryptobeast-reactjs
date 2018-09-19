// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
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
});

type Props = {
  id: string,
  classes: Object,
  PortfolioStore: Object,
};

type State = {
  open: boolean,
};

@inject('PortfolioStore')
@observer
class RemovePortfolio extends React.Component<Props, State> {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleRemove = () => {
    const { PortfolioStore, id } = this.props;
    PortfolioStore.removePortfolio(id);
    this.setState({ open: false });
  };

  render() {
    const { classes, PortfolioStore } = this.props;
    const { portfolios } = PortfolioStore;

    return (
      <div style={{ display: 'inline-block' }}>
        <IconButton
          customClass="remove"
          onClick={this.handleOpen}
          color="primary"
        >
          <Close style={{ width: '.8em', height: '.8em' }} />
        </IconButton>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <div
            style={getModalStyle()}
            className={classes.paper}
            onSubmit={() => this.handleRemove}
          >
            <Typography
              className={classes.modalTitle}
              variant="title"
              id="modal-title"
            >
              Are you sure you want to delete this portfolio? {this.props.id}
            </Typography>

            <br />

            {/* Cancel BUTTON */}
            <Button
              style={{ display: 'inline-flex', float: 'left', marginRight: '50px' }}
              onClick={this.handleClose}
              color="primary"
            >
              {' '}
              Cancel
            </Button>

            {/* SAVE BUTTON */}
            <Button
              style={{ display: 'inline-flex', float: 'right' }}
              type="submit"
              color="primary"
              onClick={() => this.handleRemove(portfolios.id)}

            >
              {' '}
              DELETE
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

// We need an intermediary variable for handling the recursive nesting.
const RemovePortfolioWrapped = withStyles(styles)(RemovePortfolio);

export default RemovePortfolioWrapped;
