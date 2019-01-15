// @flow
import React from 'react';
import { withStyles, Grid, Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { inject, observer } from 'mobx-react';
import { ValidatorForm } from 'react-material-ui-form-validator';

const getModalStyle = () => {
  const top = 25;
  const left = 35;
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
};

const styles = (theme: Object) => ({
  paper: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    width: '550px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '-1px 13px 57px 16px rgba(0,0,0,0.21)',
    padding: '30px',
  },
  paperContainer: {
    margin: '0 -40px',
  },
  gridColumn: {
    width: '50%',
  },
  gridRow: {
    padding: '10px 40px 3px 40px',
  },
  tableBtn: {
    margin: 0,
    minHeight: '23px',
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: '0.75rem',
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
  },
  negative: {
    color: '#eb4562',
  },
});

type Props = {
  transaction: Object,
  investorId: number,
  investorName: string,
  closeParent: any,
  classes: Object,
  TransactionStore: Object,
  InvestorStore: Object,
};

type State = {
  open: boolean,
  selectedInvestor: Object,
};

@inject('TransactionStore', 'InvestorStore')
@observer
class AssignInvestorConfirm extends React.Component<Props, State> {
  state = {
    open: false,
    ableToAssign: false,
  };

  componentWillUpdate(nextProps: object) {
    if (nextProps.investorId !== this.props.investorId) {
      this.handleAbleToAssign(nextProps.investorId);
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAbleToAssign = (investorId: number) => {
    if (investorId !== null && investorId !== undefined) {
      this.setState({ ableToAssign: true });
    }
  };

  handleSave = () => {
    const { TransactionStore } = this.props;
    TransactionStore.setInvestor(this.props.transaction.id, this.props.investorId);
    this.props.closeParent();
    this.handleClose();
  }

  render() {
    const { classes, investorName, investorId, transaction, InvestorStore } = this.props;
    const abbleToConfirm = InvestorStore.ableToassignTransaction(transaction, investorName, investorId);

    return (
      <span>
        <Button
          onClick={this.handleOpen}
          color="primary"
          style={{ marginLeft: '25px' }}
          disabled={!this.state.ableToAssign}
        >
          Save
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <ValidatorForm
            onSubmit={this.handleSave}
            style={getModalStyle()}
            className={classes.paper}
          >
            <div className={classes.paperContainer}>
              <div className={classes.gridRow}>
                <Typography
                  variant="title"
                  id="modal-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: '400',
                    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
                    textTransform: 'uppercase',
                  }}
                  gutterBottom
                >
                  Assign Investor
                </Typography>
              </div>
              {abbleToConfirm
                ?
                <div className={classes.gridRow}>
                  Are you sure you want to assign this transaction to {investorName}?
                </div>
                :
                <div className={[classes.gridRow, classes.negative].join(' ')}>
                  This investor does not have enough shares for the withdrawal.
                </div>
              }
              <Grid container justify="flex-end">
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow} style={{ textAlign: 'right' }}>
                    <Button
                      color="primary"
                      onClick={this.handleClose}
                    >
                      Cancel
                    </Button>
                    {abbleToConfirm
                      ?
                      <Button
                        type="submit"
                        color="primary"
                        style={{ marginLeft: '25px' }}
                      >
                        Save
                      </Button>
                      :
                      null
                    }
                  </div>
                </Grid>
              </Grid >
            </div>
          </ValidatorForm>
        </Modal>
      </span >
    );
  }
}

export default withStyles(styles)(AssignInvestorConfirm);
