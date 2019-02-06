// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { inject, observer } from 'mobx-react';
import moment from 'moment';

import SelectInvestor from '../../Selectors/SelectInvestor';
import AssignInvestorConfirm from './AssignInvestorConfirm';

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
    padding: '10px 40px 0 40px',
  },
  tableBtn: {
    margin: 0,
    minHeight: '23px',
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: '0.75rem',
    fontFamily: '\'Lato\', \'Helvetica\', \'Arial\', sans-serif',
  },
  adornment: {
    textTransform: 'uppercase',
    width: '70%',
  },
  fullWidth: {
    width: '100%',
  },
});

type Props = {
  transaction: Object,
  classes: Object,
  InvestorStore: Object,
};

type State = {
  open: boolean,
  selectedInvestor: Object,
};

@inject('InvestorStore', 'PortfolioStore')
@observer
class AssignInvestor extends React.Component<Props, State> {
  state = {
    open: false,
    selectedInvestor: '',
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.InvestorStore.resetUpdate();
    this.setState({ open: false, selectedInvestor: '' });
  };

  handleSelectInvestor = (value: *) => {
    this.setState({ selectedInvestor: value });
  }

  render() {
    const { classes, transaction } = this.props;

    return (
      <Grid container>
        <Button className={classes.tableBtn} onClick={this.handleOpen} color="primary">
          Assign
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <div
            // ref="form"
            // onError={errors => console.log(errors)}
            style={getModalStyle()}
            className={classes.paper}
          >
            <div className={classes.paperContainer}>
              <Grid container>
                <Grid className={classes.gridColumn}>
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
                    >
                      Assign Investor
                    </Typography>
                  </div>
                </Grid>
              </Grid>
              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <SelectInvestor
                      handleChange={this.handleSelectInvestor}
                      style={{
                        marginTop: '12px',
                        border: 'none',
                        borderRadius: 0,
                        borderBottom: '1px solid #757575',
                        textTransform: 'uppercase',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextField
                      className={classes.fullWidth}
                      value={moment(new Date(transaction.txTimestamp).getTime()).format('YYYY/MM/DD')}
                      inputProps={{
                        style: { textAlign: 'right' },
                      }}
                      // eslint-disable-next-line react/jsx-no-duplicate-props
                      InputProps={{
                        startAdornment:
                          <InputAdornment
                            position="start"
                            className={classes.adornment}
                          >
                            Date:
                          </InputAdornment>,
                      }}
                    />
                  </div>
                </Grid>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextField
                      className={classes.fullWidth}
                      value={transaction.currentSharePriceUSD.toFixed(2)}
                      inputProps={{
                        style: { textAlign: 'right' },
                      }}
                      // eslint-disable-next-line react/jsx-no-duplicate-props
                      InputProps={{
                        startAdornment:
                          <InputAdornment
                            position="start"
                            className={classes.adornment}
                          >
                            Share Price:
                          </InputAdornment>,
                      }}
                    />
                  </div>
                </Grid>
              </Grid>

              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextField
                      className={classes.fullWidth}
                      value={transaction.type === 'd' ? 'DEPOST' : 'WITHDRAW'}
                      inputProps={{
                        style: { textAlign: 'right' },
                      }}
                      // eslint-disable-next-line react/jsx-no-duplicate-props
                      InputProps={{
                        startAdornment:
                          <InputAdornment
                            position="start"
                            className={classes.adornment}
                          >
                            Type:
                          </InputAdornment>,
                      }}
                    />
                  </div>
                </Grid>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextField
                      className={classes.fullWidth}
                      value={transaction.sharesCreated !== null ? transaction.sharesCreated.toFixed(2) : transaction.sharesLiquidated.toFixed(2)}
                      inputProps={{
                        style: { textAlign: 'right' },
                      }}
                      // eslint-disable-next-line react/jsx-no-duplicate-props
                      InputProps={{
                        startAdornment:
                          <InputAdornment
                            position="start"
                            className={classes.adornment}
                          >
                            Total Shares:
                          </InputAdornment>,
                      }}
                    />
                  </div>
                </Grid>
              </Grid>

              <Grid container>
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow}>
                    <TextField
                      className={classes.fullWidth}
                      value={transaction.totalValueUSD.toFixed(2)}
                      inputProps={{
                        style: { textAlign: 'right' },
                      }}
                      // eslint-disable-next-line react/jsx-no-duplicate-props
                      InputProps={{
                        startAdornment:
                          <InputAdornment
                            position="start"
                            className={classes.adornment}
                          >
                            Amount (USD):
                          </InputAdornment>,
                      }}
                    />
                  </div>
                </Grid>
              </Grid>

              <Grid container justify="flex-end">
                <Grid className={classes.gridColumn}>
                  <div className={classes.gridRow} style={{ textAlign: 'right' }}>
                    <Button
                      color="primary"
                      onClick={this.handleClose}
                    >
                      Cancel
                    </Button>
                    <AssignInvestorConfirm
                      transaction={transaction}
                      investorId={this.state.selectedInvestor.value}
                      investorName={this.state.selectedInvestor.label}
                      closeParent={this.handleClose}
                    />
                  </div>
                </Grid>
              </Grid >
            </div>
          </div>
        </Modal>
      </Grid >
    );
  }
}

export default withStyles(styles)(AssignInvestor);
