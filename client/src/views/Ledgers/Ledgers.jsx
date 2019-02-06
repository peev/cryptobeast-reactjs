import React from 'react';
// import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';

import { ItemGrid } from './../../components';

import iconsStyle from './../../variables/styles/iconsStyle';

function Ledgers() {
  return (
    <Grid container>
      <ItemGrid xs={12} sm={12} md={12}>
        <p>Ledgers is under construction...</p>
      </ItemGrid>
    </Grid>
  );
}

// Ledgers.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(iconsStyle)(Ledgers);
