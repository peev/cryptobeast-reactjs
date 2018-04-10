import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid } from 'material-ui';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';

import InvestorCard from '../../CustomElements/InvestorCard';
import Button from '../../CustomButtons/Button';
import InvestorCardButton from '../../CustomButtons/InvestorCardButton';
import buttonStyle from '../../../variables/styles/buttonStyle';
import InvestorPieChart from '../../HighCharts/InvestorPie';

const getModalStyle = () => {
  const top = 22;
  const left = 28;
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
};

const styles = theme => ({
  paper: {
    position: 'absolute',
    minWidth: '100px',
    width: '600px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4,
  },
  button: {
    float: 'right',
  },
});

class SharesInCirculation extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        <InvestorCardButton onClick={this.handleOpen}>
          <InvestorCard headerText="1180" labelText="Shares in Circulation" />
        </InvestorCardButton>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <div
            style={getModalStyle()}
            className={classes.paper}
          >
            <Grid container>
              <Grid item xs={12} sm={12} md={12}>
                <Typography
                  variant="title"
                  id="modal-title"
                  style={{ fontSize: '18px', fontWeight: '400' }}
                >
                  Shareholders Breakdown
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <InvestorPieChart />
              </Grid>

              <Grid item xs={12} sm={12} md={12} >
                <Button
                  style={{ float: 'right' }}
                  onClick={this.handleClose}
                  color="primary"
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </Grid>
    );
  }
}

SharesInCirculation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, buttonStyle)(SharesInCirculation);
