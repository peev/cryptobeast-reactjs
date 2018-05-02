import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, } from 'material-ui';
import { inject, observer } from 'mobx-react';

import InvestorCard from '../../CustomElements/InvestorCard';
import InvestorCardButton from '../../CustomButtons/InvestorCardButton';


const styles = () => ({
  card: {
    color: 'red'
  },
});

@inject('InvestorStore')
@observer
class TotalFeePotential extends React.Component {
  state = {};

  render() {
    const { classes, InvestorStore } = this.props;

    return (
      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          {/* <InvestorCardButton
            // disabled="disabled"
            notActive="notActive"
            >
          </InvestorCardButton> */}
          <InvestorCard
            className={classes.card}
            headerText={`$${InvestorStore.totalFeePotential}`}
            labelText="Total Fee Potential"
          />
        </Grid >
      </Grid >
    );
  }
}

TotalFeePotential.propTypes = {
  classes: PropTypes.object.isRequired,
  InvestorStore: PropTypes.object,
};

export default withStyles(styles)(TotalFeePotential);
