import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid } from 'material-ui';
import Typography from 'material-ui/Typography';

import Modal from 'material-ui/Modal';
import InvestorCard from '../../CustomElements/InvestorCard';
import InvestorCardButton from '../../CustomButtons/InvestorCardButton';
import Button from '../../CustomButtons/Button';

import InvestorsTable from '../../CustomTables/InvestorsTable';
import buttonStyle from '../../../variables/styles/buttonStyle';

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
    width: '730px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing.unit * 4,
  },
});

class TotalInvestors extends React.Component {
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
          <InvestorCard headerText="10" labelText="Total Investors" />
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
                  Total Investors
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <InvestorsTable
                  tableHead={[
                    'name',
                    'name',
                    'name',
                    'name',
                    'name',
                    'name',
                    'name',
                    'name',
                    'name',
                    'name',
                    'name',
                  ]}
                  tableData={[
                    [
                      'Name',
                      'name',
                      'name',
                      'name',
                      'name',
                      'name',
                      'name',
                      'name',
                      '',
                    ],

                    [
                      'Name',
                      'name',
                      'name',
                      'name',
                      'name',
                      'name',
                      'name',
                      'name',
                      '',
                    ],

                    [
                      'Name',
                      'name',
                      'name',
                      'name',
                      'name',
                      'name',
                      'name',
                      'name',
                      '',
                    ],

                    [
                      'Name',
                      'name',
                      'name',
                      'name',
                      'name',
                      'name',
                      'name',
                      'name',
                      '',
                    ],
                  ]}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} >
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </Grid>
    );
  }
}

TotalInvestors.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, buttonStyle)(TotalInvestors);
